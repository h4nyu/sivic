/* Replace with your SQL commands */

CREATE TABLE workspaces ( 
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp NOT NULL
);

CREATE TABLE workspace_images ( 
    workspace_id text NOT NULL,
    image_id text NOT NULL,
    tag text,
    updated_at timestamp NOT NULL,
    created_at timestamp NOT NULL,
    UNIQUE(workspace_id, image_id)
);
