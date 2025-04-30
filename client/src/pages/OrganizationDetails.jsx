import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from '../hooks/Auth'
import { useState, useEffect } from "react";
import { supabaseClient as supabase } from '../config/supabase-client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

const roles = ['owner', 'technician'];

export default function OrganizationDetails(){
  const { organizationID } = useParams();
  const [users, setUsers] = useState([]);
  const { user: {id: userID}} = useAuth();
  const navigate = useNavigate();

  async function getOrganizationUsers(setter) {
    
    // If user is not an owner, redirect them from the page
    const { count } = await supabase
      .from('Permissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userID)
      .eq('permission_level', "owner")
    if(count < 1){
      navigate('/manage-organization')
    }

    // use API to get the info on permission and user info from the organizationID
    // Have an array of objects to hold the state of them.

    let { data, error } = await supabase
      .from('Permissions')
      .select('id, permission_level, users(email)')
      .eq('organization_id', organizationID)

    if(error){
      console.error(error)
    }
    
    // [{user_id, permission_level, users: {email} }, ...]
  
    data = data.map(({permission_level: role, id, users: {email}}) => ({role, id, email})
    )
    setter(data)
    // console.log(data)
  }

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = randomId();
      setRows((oldRows) => [...oldRows, { id, email: '', role: 'technician', isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'email' },
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
    const [rows, setRows] = useState(users);
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
      const isOwner = selectedRow.role === 'owner'
      if(isOwner){
        const confirmation = window.confirm(`Please confirm you want to remove ${selectedRow.email} from having permissions`)
        if(!confirmation){
          console.warning('Deletion canceled, due to no confirmation.')
          return
        }
      }
      // api call to delete
      const { error } = await supabase
      .from('Permissions')
        .delete()
        .eq('id', id)
      if(error){console.error('deletion error:', error)}
      setUsers(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });

      const editedRow = rows.find((row) => row.id === id);
      if (editedRow.isNew) {
        setUsers(rows.filter((row) => row.id !== id));
      }
    };

    const processRowUpdate = async (newRow) => {
      const {id, role, email} = newRow
      const { data: matches, error: searchError } = await supabase
        .from('Permissions')
        .select()
        .eq('id', id)
      if(searchError){
        console.error(searchError)
      }
      const hasRow = matches.length > 0
      if(hasRow){
        const { error: insertionError } = await supabase
          .from('Permissions')
          .update({ 'permission_level': role })
          .eq('id', id)
        if(insertionError){
          console.error('insertion error:', insertionError)
        }
        // console.log('update completed')
      }else{
        const { data: userData } = await supabase
          .from('users')
          .select()
          .eq('email', email);
        if(userData.length < 1){
          window.alert(`Invalid Email: No users registered with that email address "${email}".`)
          return;
          // no registered user with a matching email exists
          // make an error visible to user and make no insertion
        }
        // clear the error state

        const [{id: user_id }] = userData
        // otherwise make a new permission insertion

        // console.log('new record being created')
        const { error: updateError } = await supabase
          .from('Permissions')
          .insert({
            id,
            permission_level: role,
            user_id,
            organization_id: organizationID
          })
        if(updateError){
          console.error('update error:', updateError)
        }
        // grab the id from the returning record
      }
      const updatedRow = { ...newRow, isNew: false };
      // console.log(updatedRow)
      setUsers(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };

    const columns = [
      { field: 'email', headerName: 'Email', width: 220, editable: true },
      {
        field: 'role',
        headerName: 'Role',
        width: 180,
        editable: true,
        type: 'singleSelect',
        valueOptions: roles,
      },
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
            // make it so that emails are only editable if new
            // params.row.isNew
            // params.field === 'email'
            // console.log(params)
            if(params.field === 'email' && !params.row.isNew){
              return false
            }
            return params.row.role !== 'owner'
          }}
        />
      </Box>
    );
  }
  // eslint-disable-next-line
  useEffect(() => {getOrganizationUsers(setUsers)}, [])

  return (
  <Container sx={{mt: 5}}>
    <FullFeaturedCrudGrid/>
  </Container>
  )
}