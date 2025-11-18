import "reflect-metadata";
import { DataSource } from "typeorm";
import { Track } from "../model/Track";
import { User } from "../model/User";
import { Topic } from "../model/Topic";
import { SubTopic } from "../model/SubTopic";

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "preptrack",
  synchronize: true,
  logging: false,
  entities: [Track, User, Topic, SubTopic],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  if (PostgresDataSource.isInitialized) return PostgresDataSource;
  return PostgresDataSource.initialize();
};
