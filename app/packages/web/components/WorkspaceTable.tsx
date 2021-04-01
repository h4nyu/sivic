import React, { useState } from 'react';
import { List } from "immutable";

import { Workspace } from "@sivic/core/workspace";
import DateView from "@sivic/web/components/DateView";
import TableHeader from "@sivic/web/components/TableHeader";
import Divider from "@sivic/web/components/Divider";
import DeleteBtn from "@sivic/web/components/DeleteBtn";
import SaveBtn from "@sivic/web/components/SaveBtn";
import CreateBtn from "@sivic/web/components/CreateBtn";


export const WorkspaceTable = (props: {
  name?: string,
  workspaces: Workspace[];
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?:() => void;
  onNameChange?:(name: string) => void;
  onSave?: () => void;
}) => {
  const { 
    workspaces, 
    onClick, 
    onDelete, 
    onCreate, 
    onSave,
    onNameChange 
  } = props;

  let rows = List(workspaces).map(x => {
    return {
      ...x,
      Name: x.name,
      Create:x.createdAt,
      onClick: () => onClick && onClick(x.id),
      onDelete: () => onDelete && onDelete(x.id),
    }
  })
  return (
    <div style={{width:"100%"}}>
      {
        <div
          style={{ 
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            alignItems: "center",
          }}
        >
          <div className="p-1" > 
            {
              onNameChange && <input className="input is-small" value={props.name} onChange={e => onNameChange(e.target.value)} /> 
            }
          </div>
          <div className="p-1" > 
            {
              onSave && <SaveBtn onClick={onSave} /> 
            }
          </div>
        </div>
      }
      <Divider/>
      {rows
        .map((x, i) => {
          return (
            <div
              key={i}
            >
              <div
                style={{ 
                  cursor: onClick ? "pointer" : "",
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                }}
              >
                <div className="p-1" onClick={x.onClick}> {x.name} </div>
                <div className="p-1" onClick={x.onClick}> <DateView value={x.createdAt} /> </div>
                <div className="p-1"> <DeleteBtn onClick={x.onDelete} /> </div>
              </div>
              <Divider/>
            </div>
          );
        })}
    </div>
  );
};
export default WorkspaceTable;
