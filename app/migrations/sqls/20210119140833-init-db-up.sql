/* Replace with your SQL commands */

CREATE TABLE workspaces ( 
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp NOT NULL
);

CREATE TABLE workspace_images ( 
    image_id text NOT NULL,
    workspace_id text NOT NULL,
    tag text,
    parent_id text,
    created_at timestamp NOT NULL,
    UNIQUE(workspace_id, image_id)
);
