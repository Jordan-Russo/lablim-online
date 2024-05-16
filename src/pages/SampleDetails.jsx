import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from '../hooks/Auth'
import { useState, useEffect } from "react";
import { supabaseClient as supabase } from '../config/supabase-client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomId
} from '@mui/x-data-grid-generator';

const statusOptions = ['pending', 'in progress', 'complete', 'canceled'];

export default function SampleDetails(){
  const { sampleID } = useParams();
  const [tests, setTests] = useState([]);
  const { user: {id: userID}} = useAuth();
  const [sampleName, setSampleName] = useState('')
  const [orderID, setOrderID] = useState('')
  // userID will be used to prevent DB entry to unauthorized users
  const navigate = useNavigate();

  async function getTests(setter) {
    // Use API to get the name of the sample from the sampleID
    let { data: sampleData } = await supabase
    .from('Samples')
    .select('name, from_order')
    .eq('id', sampleID)
    
    const [{name: sampleTitle, from_order: fromOrder}] = sampleData
    
    setSampleName(sampleTitle)
    setOrderID(fromOrder)

    // use API to get the orderID and organizationID from the sampleID
    let { data: orderData } = await supabase
    .from('Orders')
    .select('id, order_requested_by, order_received_by')
    .eq('id', fromOrder)


    const [{order_requested_by: ownerID, order_received_by: organizationID}] = orderData


    
    // If user did not create order or is not from the organization, redirect them from the page
    // or to exclude certain types of users

    const isOwner = ownerID === userID

    const { count: isFromOrganization } = await supabase
      .from('Permissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userID)
      .eq('organization_id', organizationID)
      .not('permission_level', 'is', 'customer')

    console.log(`Is Owner: ${Boolean(isOwner)}. Is From Organiztion ${Boolean(isFromOrganization)}`)

    const notAuthorized = !isOwner && !isFromOrganization

    if(notAuthorized){
      navigate('/manage-organization')
      return;
    }
    // Use API to get all tests that are from the sample

    let { data, error } = await supabase
      .from('Tests')
      .select('id, description, result, status')
      .eq('from_sample', sampleID)

    if(error){
      console.log(error)
    }
    
    // [{id, description, result, status}, ...]
  
    data = data.map(({id, description, result, status}) => ({id, description, result, status})
    )
    setter(data)
    console.log(data)
  }

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId();
      setRows((oldRows) => [...oldRows, { id, description: '', result: '', status: 'pending', from_sample: sampleID, isNew: true }]);

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'description' },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  // https://mui.com/x/react-data-grid/editing/#system-FullFeaturedCrudGrid.js
  function FullFeaturedCrudGrid() {
    const [rows, setRows] = useState(tests);
    const [rowModesModel, setRowModesModel] = useState({});

    const handleRowEditStop = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };

    const handleEditClick = (id) => () => {
      console.log(rowModesModel)
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) =>  () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
      const selectedRow = rows.find((row) => row.id === id)
      const confirmation = window.confirm(`Please confirm you want to remove ${selectedRow.description} as a test from the sample.`)
      if(!confirmation){
        console.log('Deletion canceled, due to no confirmation.')
        return
      }
      // api call to delete
      const { error: testDeletions } = await supabase
      .from('Tests')
        .delete()
        .eq('id', id)
      if(testDeletions){console.error('deletion error:', testDeletions)}
      setTests(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });

      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        setTests(rows.filter((row) => row.id !== id));
      }
    };

    const processRowUpdate = async (newRow) => {
      const { id, description, result, status, from_sample } = newRow
      const { data: matches, error: searchError } = await supabase
        .from('Tests')
        .select()
        .eq('id', id)
      if(searchError){
        console.error('search error', searchError)
      }
      const hasRow = matches.length > 0
      if(hasRow){
        const { error: updateError } = await supabase
          .from('Tests')
          .update({ description, result, status })
          .eq('id', id)
        if(updateError){
          console.error('update error:', updateError)
        }
        console.log('update completed')
      }else{
        console.log('new test being created')
        const { error: insertionError } = await supabase
          .from('Tests')
          .insert({ 
            id, 
            description, 
            result, 
            status,
            from_sample
          })
        if(insertionError){
          console.error('insertion error:', insertionError)
        }
      }
      const updatedRow = { ...newRow, isNew: false };
      setTests(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    const columns = [
      { field: 'description', headerName: 'Description', width: 200, editable: true },
      {
        field: 'status',
        headerName: 'Status',
        width: 180,
        editable: true,
        type: 'singleSelect',
        valueOptions: statusOptions,
      },
      { field: 'result', headerName: 'Result', width: 200, editable: true },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ];

    return (
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error(error)
          }}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          isCellEditable={(params) => {
            // for future:
              // make it so that a sample from a completed order cannot be editable
            return true
          }}
        />
      </Box>
    );
  }
  // eslint-disable-next-line
  useEffect(() => {getTests(setTests)}, [])

  function ReturnButton({str}){
    return (
      <Button color="primary" variant="contained" onClick={() => navigate(`/manage-order/${orderID}`)}>
        {str}
      </Button>
    )
  }

  function Title({str}){
    return (
      <Typography variant="h1" sx={{ mb: 2, textAlign: 'center'}}>
        {str}
      </Typography>
    )
  }

  return (
  <Container sx={{mt: 5}}>
    <Title str={sampleName}/>
    <FullFeaturedCrudGrid/>
    <ReturnButton str="Go Back to Samples"/>
  </Container>
  )
}