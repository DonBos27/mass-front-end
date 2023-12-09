import { list } from "@material-tailwind/react";
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import InputContainer from "./InputContainer";
import {
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Card from "./Card";
import { List } from "@mui/icons-material";
import Tittle from "./Tittle";
function Lists({ list, index }) {
  //console.log(list.id);
  return (
    <>
      <Draggable draggableId={list.id} index={index} key={index}>
        {(provided) => (
          <div {...provided.draggableProps} ref={provided.innerRef}>
            <div
              className="w-[300px] mr-[0.5rem] rounded-lg bg-white"
              {...provided.dragHandleProps}
            >
              <div className="px-[1rem] py-[1rem]">
                <Tittle title={list.title} listId={list.id} />
              </div>
              <div className=" overflow-x-auto max-h-[55hv] p-[0 1rem]">
                <Droppable droppableId={list.id} type="task">
                  {(provided) => (
                    <div
                      className=" overflow-x-hidden m-[0.5rem 0]"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {list.cards.map((card, index) => (
                        <Card
                          key={card.id}
                          card={card}
                          index={index}
                          listId={list.id}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              <InputContainer listId={list.id} type="card" />
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
}

export default Lists;
