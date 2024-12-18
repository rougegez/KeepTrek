import os
from fastapi import FastAPI
from dotenv import dotenv_values
from azure.cosmos.aio import CosmosClient
from azure.cosmos import PartitionKey, exceptions
from routes import router as todo_router

# Get the directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))
# Construct the path to the .env file
env_path = os.path.join(current_dir, '..', '.env')
# Load the .env file
config = dotenv_values(env_path)

# Instantiate FastAPI and define the Database and Container name.
app = FastAPI()
DATABASE_NAME = "todo-db"
CONTAINER_NAME = "todo-items"
app.include_router(todo_router, tags=["todos"], prefix="/todos")

# Connect to the Azure Cosmos DB account by instantiating the Cosmos Client during the app startup event,
# store a reference to the database and container in the app object to use them later, and then close the client connection.
@app.on_event("startup")
async def startup_db_client():
    app.cosmos_client = CosmosClient(config["URI"], credential=config["KEY"])
    await get_or_create_db(DATABASE_NAME)
    await get_or_create_container(CONTAINER_NAME)

# Define the async get_or_create_db and get_or_create_container functions to fetch/create the database and the container.
async def get_or_create_db(db_name):
    try:
        app.database = app.cosmos_client.get_database_client(db_name)
        return await app.database.read()
    except exceptions.CosmosResourceNotFoundError:
        print("Creating database")
        return await app.cosmos_client.create_database(db_name)

# Define the async get_or_create_container function
async def get_or_create_container(container_name):
    try:
        app.container = app.database.get_container_client(container_name)
        return await app.container.read()
    except exceptions.CosmosResourceNotFoundError:
        print("Creating container")
        return await app.database.create_container(
            id=container_name,
            partition_key=PartitionKey(path="/id"),
        )
    
