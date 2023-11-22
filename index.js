// Import necessary modules and libraries
const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");

// Import custom data source for etherscan API
const EtherDataSource = require("./datasource/ethDatasource");

// Import GraphQL schema from schema.graphql file
const typeDefs = importSchema("./schema.graphql");

// Load environment variables from .env file
require("dotenv").config();

// Define GraphQL resolvers
const resolvers = {
  Query: {
    // Resolver function for fetching Ether balance by address
    etherBalanceByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver function for fetching total supply of Ether
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Resolver function for fetching the latest Ethereum price
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Resolver function for fetching block confirmation time
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Configure Apollo Server with type definitions, resolvers, and data sources
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }),
});

// Disable timeout for long-running operations
server.timeout = 0;

// Start the Apollo Server on port 9000
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
