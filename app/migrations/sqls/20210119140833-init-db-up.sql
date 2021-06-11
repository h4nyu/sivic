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

CREATE TABLE lines ( 
    id text NOT NULL PRIMARY KEY,
    image_id text NOT NULL,
    x0 double precision NOT NULL,
    y0 double precision NOT NULL,
    x1 double precision NOT NULL,
    y1 double precision NOT NULL
);
