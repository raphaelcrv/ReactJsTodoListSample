import { useState, useEffect } from "react";
import Header from "./components/Header";
import styled from "styled-components"
import './App.css';

const Container = styled.div`
      margin-bottom: 5px;
      padding: 10px;
      background-color: white;
      border-radius: 2px;
      cursor: pointer;

      input{
        width: 70%;
      }

      input:focus-visible {
        outline: 0px;
      }

      input:nth-child(1){
        width: 1.3em;
        height: 1.3em;
        background-color: white;
        border-radius: 50%;
        vertical-align: middle;
        border: 1px solid #ddd;
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        cursor: pointer;
      }
      input:nth-child(2){
        border: none;
      }

      input:checked{
        background-color: #f3f3f3;
      }

      
    `


function App() {

  const [todos, setTodos] = useState([]);
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    //response from api
    const data = [
      {
        id: 222,
        description: "Lavar as maos",
        isCompleted: true
      },
      {
        id: 123,
        description: "Escovar os dentes",
        isCompleted: false
      },
      {
        id: 124,
        description: "comer",
        isCompleted: false
      }
    ];

    setTodos(sortTodoList(data))

  }, []);

  const sortTodoList = (data) => {
    return data.sort((a, b) => {
      //sort by status completed on bottom
      let isCompleted = a.isCompleted - b.isCompleted
      if (isCompleted !== 0) {
        return isCompleted
      }
      //sort by name 
      return a.description.localeCompare(b.description);
    });
  }

  const handleEvents = (event, newTodo, index) => {
    let newArray = [...todos];
    switch (event) {
      case "delete":
        // ✅ Remove one object from state array
        console.log("delete:", newTodo, "index", index);
        newArray = newArray.filter((current, i)=>{
          return current.id != newTodo.id
        })

        setTodos(newArray);
        break;
        // ✅ update one object (todo item) from the array
      case "update":
        console.log("update:", newTodo);
        
        newArray[index].description = newTodo.description;
        //sort only when is completed
        if(newArray[index].isCompleted !== newTodo.isCompleted){
          newArray[index].isCompleted = newTodo.isCompleted;
          return setTodos(sortTodoList(newArray));
        }

        return setTodos(newArray);
        break;
        // ✅ create one object (todo item) on the array
      case "create":
        console.log("Create:", newTodoDescription);
        setErrorMessage("");
        
        if(newTodoDescription == ""){
          setErrorMessage("Digite a descricao da tarefa");
          return; 
        }

        newArray.push({
          description : newTodoDescription,
          isCompleted : false,
          id : new Date().getUTCMilliseconds()
        })
        setTodos(sortTodoList(newArray))

        //clear the input 
        setNewTodoDescription("");
        break;
        default : 
          console.log("Error");
        break;
    }
  }

  return (
    <div className="App">
      <Header />
      <>
        {todos.map((todo, index) => {
          return (
            <>
              <Container>
                <input type={"checkbox"} checked={todo.isCompleted} onClick={() => { handleEvents("update", { ...todo, isCompleted: !todo.isCompleted }, index) }} />
                <input style={{textDecoration : todo.isCompleted == true ? "line-through" : ""}} type={"text"} value={todo.description} onChange={(e) => handleEvents("update", {...todo, description : e.target.value}, index)} />
                <button style={{float: "right", display: "inline-block"}} onClick={()=>handleEvents('delete',todo,index)}>Apagar</button>
              </Container>
            </>
          )
        })}
        <input type={"text"} onChange={(e)=>setNewTodoDescription(e.target.value)} value={newTodoDescription} />
        <button onClick={()=>handleEvents('create')}>Add</button>
        {errorMessage}
      </>
    </div>
  );
}

export default App;
