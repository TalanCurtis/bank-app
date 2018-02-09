create table if not exists users (
    id serial primary key,
    user_name text,
    img text,
    auth_id text
)