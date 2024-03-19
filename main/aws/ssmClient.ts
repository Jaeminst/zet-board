import {
  SSMClient,
  StartSessionCommand,
  TerminateSessionCommand,
  type StartSessionCommandInput,
  type StartSessionCommandOutput,
  type TerminateSessionCommandInput,
  type TerminateSessionCommandOutput,
} from "@aws-sdk/client-ssm";

interface ClientConfig {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export async function startSession(config: ClientConfig, input: StartSessionCommandInput): Promise<StartSessionCommandOutput> {
  const client = new SSMClient(config);
  const command = new StartSessionCommand(input);
  const response = await client.send(command);
  return response;
}

export async function terminateSession(config: ClientConfig, input: TerminateSessionCommandInput): Promise<TerminateSessionCommandOutput> {
  const client = new SSMClient(config);
  const command = new TerminateSessionCommand(input);
  const response = await client.send(command);
  return response;
}