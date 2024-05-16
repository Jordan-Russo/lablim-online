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
import LaunchIcon from '@mui/icons-material/Launch';
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

export default function OrderDetails(){
  const { orderID } = useParams();
  const [samples, setSamples] = useState([]);
  const { user: {id: userID}} = useAuth();
  const [organizationName, setOrganizationName] = useState('')
  // userID will be used to prevent DB entry to unauthorized users
  const navigate = useNavigate();

  async function getSamples(setter) {
    
    
    // Use API to get the name of the org from the orderID
    let { data: nameData } = await supabase
    .from('Orders')
    .select('Organizations(name, id)')
    .eq('id', orderID)
    
    const [{Organizations: {id: organizationID, name: organizationTitle}}] = nameData
    
    setOrganizationName(organizationTitle)
    
    // If user did not create order or is not from the organization, redirect them from the page
    // or to exclude certain types of users

    const { count: isOwner } = await supabase
      .from('Orders')
      .select('*', { count: 'exact', head: true })
      .eq('order_requested_by', userID)
      .eq('id', orderID)

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
    // Use API to get all samples that are from the order

    let { data, error } = await supabase
      .from('Samples')
      .select('id, name')
      .eq('from_order', orderID)

    if(error){
      console.log(error)
    }
    
    // [{id, name}, ...]
  
    data = data.map(({id, name}) => ({id, name})
    )
    setter(data)
    console.log(data)
  }

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId();
      setRows((oldRows) => [...oldRows, { id, name: '', from_order: orderID, isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
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
    const [rows, setRows] = useState(samples);
    const [rowModesModel, setRowModesModel] = useState({});

    const handleRowEditStop = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };

    const handleEditClick = (id) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) =>  () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => async () => {
      const selectedRow = rows.find((row) => row.id === id)
      const confirmation = window.confirm(`Please confirm you want to remove ${selectedRow.name} from the order.`)
      if(!confirmation){
        console.log('Deletion canceled, due to no confirmation.')
        return
      }
      // api call to delete
      const { error: testDeletions } = await supabase
      .from('Tests')
        .delete()
        .eq('from_sample', id)
      if(testDeletions){console.error('deletion error:', testDeletions)}
      // must delete tests before samples though
      const { error: sampleDeletion } = await supabase
      .from('Samples')
        .delete()
        .eq('id', id)
      if(sampleDeletion){console.error('deletion error:', sampleDeletion)}
      setSamples(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });

      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        setSamples(rows.filter((row) => row.id !== id));
      }
    };

    const processRowUpdate = async (newRow) => {
      const {id, name, from_order } = newRow
      const { data: matches, error: searchError } = await supabase
        .from('Samples')
        .select()
        .eq('id', id)
      if(searchError){
        console.error(searchError)
      }
      const hasRow = matches.length > 0
      if(hasRow){
        const { error: insertionError } = await supabase
          .from('Samples')
          .update({ name })
          .eq('id', id)
        if(insertionError){
          console.error('insertion error:', insertionError)
        }
        console.log('update completed')
      }else{
        console.log('new sample being created')
        const { error: updateError } = await supabase
          .from('Samples')
          .insert({ 
            id,
            name,
            from_order
          })
        if(updateError){
          console.error('update error:', updateError)
        }
      }
      const updatedRow = { ...newRow, isNew: false };
      setSamples(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    const columns = [
      { field: 'name', headerName: 'Name', width: 200, editable: true },
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
              icon={<LaunchIcon />}
              label="Launch"
              className="textPrimary"
              onClick={() => navigate(`/manage-sample/${id}`)}
              color="inherit"
            />,
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
  useEffect(() => {getSamples(setSamples)}, [])

  function ReturnButton({url, msg}){
    return (
      <Button color="primary" variant="contained" onClick={() => navigate(url)}>
        {msg}
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
    <Title str={organizationName}/>
    <FullFeaturedCrudGrid/>
    <ReturnButton url={`/manage-order/`} msg="Return to Orders"/>
    <ReturnButton url={`/test-report/${orderID}`} msg="View Report"/>
  </Container>
  )
}