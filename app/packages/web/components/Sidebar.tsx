import React from "react"
import { NavLink } from "react-router-dom"
import store from "@sivic/web/store";

export const Sidebar = () => {
  return <div 
    className="box has-background-white-bis	" 
    style={{height:"100%"}}
  >
    <aside className="menu">
      <ul className="menu-list">
        <li>
          <NavLink to="/workspace" activeClassName="is-active">
            Workspaces
          </NavLink>
        </li>
      </ul>
    </aside>
  </div>
}

export default Sidebar
