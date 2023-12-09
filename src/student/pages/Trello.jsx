import React, { useEffect, useState } from 'react'
import NavbarStudent from '../global/NavbarStudent';
import Sidebar from '../global/Sidebar'
import EventNoteIcon from '@mui/icons-material/EventNote';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import sampleData from "../utils/sampleData"
import Lists from '../components/Lists';
import InputContainer from '../components/InputContainer';
import { v4 as uuid } from 'uuid';
import { addDoc, arrayUnion, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db, timestamp } from '../../firebase/configFirebase';
import StoreApi from '../utils/storeApi';
import useAuthUser from '../utils/useAuthUser';
function Trello({handleProfile}) {
    const[lists, setLists] = useState([]);
  const users = useAuthUser()
  useEffect(() => {
    if (users) {
      const email = users.uid;
      //console.log("Email:", email);
      const unsubscribe = onSnapshot(doc(db, "users", users.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          //console.log("Fetched data from Firestore:", data);
          setUserData(data);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [users]);
  useEffect(()=>{
    const q = query(collection(db,`lists/${users.uid}/notepad`), orderBy("timestamp", "asc"));
    onSnapshot(q, (snapShot) => {
      setLists(snapShot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
      })))
    })
  })
  const onDragEnd = async(result)=>{
    // Destructure relevant properties from the 'result' object
    const {destination,source,draggableId,type} = result;
    // Check if there is no valid destination for the drag-and-drop
    if(!destination){
      return;
    }
    // If the type is "list," swap the positions of two lists
    if(type === "list"){
      // Get references to the source and destination lists in Firestore
      const destinationRef = doc(db,`lists/${users.uid}/notepad`,lists[destination.index].id);
      const sourceRef = doc(db,`lists/${users.uid}/notepad`,lists[source.index].id)
      // Swap the 'timestamp' values between the source and destination lists
      await updateDoc(destinationRef,{
        timestamp:lists[source.index].timestamp
      });
      await updateDoc(sourceRef,{
        timestamp:lists[destination.index].timestamp
      });
      return;
    }
    // If the source and destination droppable IDs are the same, rearrange cards within the same list
    else if(source.droppableId === destination.droppableId){
      // Find the list where the drag-and-drop occurred
      const list = lists.find((list)=>list.id===source.droppableId);
      // Create an updated list of cards with the order adjusted
      const updatedCards = list.cards.map((card,index) =>{
        if(index===source.index){
          return list.cards[destination.index]
        }
        if(index===destination.index){
          return list.cards[source.index]
        }
        return card;
      })
      // Get a reference to the Firestore document of the list and update the 'cards' field
      const listRef = doc(db,`lists/${users.uid}/notepad`,destination.droppableId);
      await updateDoc(listRef,{
        cards:updatedCards
      })
    }
    else{
      // Moving a card from one list to another

      // Find the source and destination lists
      const sourceList = lists.find((list)=>list.id===source.droppableId);
      const destinationList = lists.find((list)=>list.id===destination.droppableId);
      // Get the card being dragged
      const draggingCard = sourceList.cards.filter((card)=>card.id===draggableId)[0];
      // Get references to the source and destination lists in Firestore
      const sourceListRef = doc(db,`lists/${users.uid}/notepad`,source.droppableId);
      // Remove the card from the source list
      sourceList.cards.splice(source.index,1)
      // Update the source list in Firestore with the updated 'cards' field
      await updateDoc(sourceListRef,{
        cards:sourceList.cards,
      })
      // Get a reference to the destination list in Firestore
      const destinationListRef = doc(db,`lists/${users.uid}/notepad`,destination.droppableId);
      // Insert the dragging card at the appropriate position in the destination list
      destinationList.cards.splice(destination.index,0,draggingCard);
      // Update the destination list in Firestore with the updated 'cards' field
      await Promise.all([
        updateDoc(sourceListRef, { cards: sourceList.cards }),
        updateDoc(destinationListRef, { cards: destinationList.cards }),
      ]);
    }
  }
    const addMoreCard = async(title,listId)=>{
        if(!title){
            return;
        }
        const newCardId = uuid();
        const newCard = {
            id: newCardId,
            title,
        };

        const listRef = doc(db, `lists/${users.uid}/notepad`,listId);
        await updateDoc(listRef, {
            cards: arrayUnion(newCard),
        });

    }
    const removeCard = (index, listId,cardId) =>{
        const listRef = doc(db, `lists/${users.uid}/notepad`,listId);
        lists.forEach(async(list) =>{
            if(list.id===listId){
                list.cards.splice(index,1)
                await updateDoc(listRef, {
                    cards:list.cards.filter(card=>card.id!== cardId)
                })
            }
            return list;
        });
    };

    const updateCardTitle = (title,index,listId,cardId)=>{
        const listRef = doc(db, `lists/${users.uid}/notepad`,listId);
        lists.forEach(async(list) =>{
            if(list.id===listId){
                list.cards[index].title = title;
                await updateDoc(listRef, {
                    cards:list.cards.map((card)=>{
                        if(card.id===cardId){
                            card.title=title;
                            return card
                        }
                        return card
                    })
                })
            }
            return list;
        })
    }
    const addMoreList = async(title)=>{
        if(!title){
            return;
        }
        await addDoc(collection(db,`lists/${users.uid}/notepad`),{
            title,
            cards:[],
            timestamp
        })
    }
    

    const updateListTitle = (title,listId)=>{
        const listRef = doc(db, `lists/${users.uid}/notepad`,listId);
        lists.forEach(async(list) =>{
            if(list.id===listId){
                list.title = title;
                await updateDoc(listRef, {
                    title:title
                })
            }
            return list;
        })
    }

    const deleteList = async(listId)=>{
        await deleteDoc(doc(db,`lists/${users.uid}/notepad`,listId));
    }
    return (
        
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full mx-4 mb-4 mt-4 h-screen">
        <NavbarStudent Icon={EventNoteIcon} title={"Trello"} handleProfile={handleProfile} />
        <DragDropContext onDragEnd={onDragEnd}>
        <StoreApi.Provider
        value={{
            addMoreCard,
            removeCard,
            updateCardTitle,
            addMoreList,
            updateListTitle,
            deleteList
            
        }}
        >
          
            <Droppable droppableId='app' type='list' direction='horizontal'>
                {(provided) => (
                    <div className=" w-[100%] p-[0.5rem] grid gap-y-10 gap-x-5 md:grid-cols-2 xl:grid-cols-4 min-h-[calc(100hv-5rem)] overflow-y-auto" ref={provided.innerRef}>
                        {lists.map((list, index) => {
                            return <Lists key={list.id} list={list} index={index} />
                        })}
                        <div>
                            <InputContainer type="list" />
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
           
        </StoreApi.Provider>
        </DragDropContext>
      </div>
    </div>
    
  )
}

export default Trello
