// import React, { useState } from 'react';
// import { List } from "immutable";

// import { Image } from "@sivic/core/image";
// import DateView from "@sivic/web/components/DateView";
// import TableHeader from "@sivic/web/components/TableHeader";

// const columns = [
//   "Name",
//   "Create",
// ];

// const filterColumns = [
//   "Name",
// ];

// export const ImageTable = (props: {
//   images: Image[];
//   onClick?: (id: string) => void;
// }) => {
//   const { images, onClick } = props;
//   const [sort, setSort] = React.useState<[string, boolean]>(["Name", true]);
//   const [sortColumn, asc] = sort;

//   let rows = List(images).map(x => {
//     return {
//       ...x,
//       Name: x.name,
//       Create:x.createdAt,
//       onClick: () => onClick && onClick(x.id),
//     }
//   })
//    .sortBy((x) => x[sortColumn]);
//    if (asc) {
//      rows = rows.reverse();
//    }

//   return (
//     <div style={{width:"100%"}}>
//       <table className="table is-fullwidth">
//         <TableHeader
//           columns={columns}
//           sortColumns={columns}
//           onChange={setSort}
//           sort={sort}
//         />
//         <tbody>
//           {rows
//             .map((x, i) => {
//               return (
//                 <tr
//                   key={i}
//                   style={{ cursor: onClick ? "pointer" : "" }}
//                 >
//                   <td> <a onClick={x.onClick}> {x.id} </a> </td>
//                   <td> <DateView value={x.createdAt} /> </td>
//                 </tr>
//               );
//             })}
//         </tbody>
//       </table>
//     </div>
//   );
// };
// export default ImageTable;
