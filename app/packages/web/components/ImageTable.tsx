import React, { useState } from 'react';
import { List } from "immutable";

import { Image } from "@charpoints/core/image";
import DateView from "@sivic/web/components/DateView";
import TableHeader from "@sivic/web/components/TableHeader";
import DeleteBtn from "@sivic/web/components/DeleteBtn";

const columns = [
  "Name",
  "Create",
  "Action",
];

const filterColumns = [
  "Name",
];

export const WorkspaceTable = (props: {
  images: Image[];
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => {
  const { images, onClick, onDelete } = props;
  const [sort, setSort] = React.useState<[string, boolean]>(["Name", true]);
  const [sortColumn, asc] = sort;
  let rows = List(images).map(x => {
    return {
      ...x,
      Name: x.name,
      Create:x.createdAt,
      onClick: () => onClick && onClick(x.id),
      onDelete: () => onDelete && onDelete(x.id),
    }
  }).sortBy((x) => x[sortColumn]);
   if (asc) {
     rows = rows.reverse();
   }

  return (
    <div style={{width:"100%"}}>
      <table className="table is-fullwidth">
        <TableHeader
          columns={columns}
          sortColumns={columns}
          onChange={setSort}
          sort={sort}
        />
        <tbody>
          {rows
            .map((x, i) => {
              return (
                <tr
                  key={i}
                  style={{ cursor: onClick ? "pointer" : "" }}
                >
                  <td> <a onClick={x.onClick}> {x.name} </a> </td>
                  <td> <DateView value={x.createdAt} /> </td>
                  <td> <DeleteBtn onClick={x.onDelete} /> </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default WorkspaceTable;
