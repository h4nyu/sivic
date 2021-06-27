/* Replace with your SQL commands */

CREATE TABLE workspaces ( 
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp NOT NULL
);

CREATE TABLE images ( 
    id text NOT NULL,
    name text NOT NULL,
    workspace_id text,
    tag_id text,
    parent_id text,
    file_id text,
    created_at timestamp NOT NULL
);

CREATE TABLE boxes ( 
    id text NOT NULL,
    x0 double precision NOT NULL,
    y0 double precision NOT NULL,
    x1 double precision NOT NULL,
    y1 double precision NOT NULL,
    image_id text,
    tag_id text
);

CREATE TABLE points ( 
    id text NOT NULL,
    x double precision NOT NULL,
    y double precision NOT NULL,
    image_id text
);

CREATE TABLE lines ( 
    id text NOT NULL PRIMARY KEY,
    image_id text,
    x0 double precision NOT NULL,
    y0 double precision NOT NULL,
    x1 double precision NOT NULL,
    y1 double precision NOT NULL
);
