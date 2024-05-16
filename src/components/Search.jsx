import { Form, Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { useNavigate } from 'react-router-dom';

export default function Search({id, btnMsg, placeholder}) {
const navigate = useNavigate()
async function handleSearch(e) {
  const userInput = document.querySelector(`#${id}`).value;
  if(!userInput){
    console.error('No user input provided')
    return
  }
  // Should instead be implemented as 
  // implement db check to include proper permissions for user authentication 
  // i.e. if the user role is a customer but they're looking at an order that 
  // they didn't make redirect
  navigate(`/order/${userInput}`)
} 
  return (
    <>
      <Form onSubmit={handleSearch}>
        <InputGroup>
          <Input id={id} placeholder={placeholder} autoComplete='off'/>
          <InputGroup.Button onClick={handleSearch}>
            <SearchIcon/>
            &nbsp;{btnMsg}
          </InputGroup.Button>
        </InputGroup>
      </Form>
    </>
  )
}