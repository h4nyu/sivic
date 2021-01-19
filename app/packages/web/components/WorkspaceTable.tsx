import React from "react";
import { List } from "immutable";

import { Workspace } from "@sivic/core/workspace";
import DateView from "@sivic/web/components/DateView";
import TableHeader from "@sivic/web/components/TableHeader";

const columns = [
  "Id",
  "Name",
  "Create",
];

const filterColumns = [
  "Id",
  "Name",
];

export const WorkspaceTable = (props: {
  workspaces: Workspace[];
  onClick?: (id: string) => void;
}) => {
  const { workspaces, onClick } = props;
  const [sort, setSort] = React.useState<[string, boolean]>(["Id", true]);
  const [sortColumn, asc] = sort;
  // const lowerKeyowerd = keyword.toLowerCase();

  let rows = List(workspaces).map(x => {
    return {
      ...x,
      Id: x.id,
      Name: x.name,
      Create:x.createdAt,
      onClick: () => onClick && onClick(x.id),
    }
  })
  // .filter(x =>  filterColumns
  //     .map((c) => x[c])
  //     .join(" ")
  //     .toLowerCase()
  //     .includes(lowerKeyowerd)
  //  )
   .sortBy((x) => x[sortColumn]);
   if (asc) {
     rows = rows.reverse();
   }

  return (
    <div style={{width:"100%"}}>
      <input
        className="input"
        type="text"
        onChange={(e) => console.log(e.target.value)}
      />
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
                  <td> <a onClick={x.onClick}> {x.id} </a> </td>
                  <td> {x.name} </td>
                  <td> <DateView value={x.createdAt} /> </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default WorkspaceTable;
