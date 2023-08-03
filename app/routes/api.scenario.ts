import { type ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import type { Message } from "ai";
import { LangChainStream } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { StreamingTextResponse } from "~/lib/ai-hacks";

export const action = async ({ request }: ActionArgs) => {
  try {
    const { messages } = await request.json();
    //   const { content: question } = messages[messages.length - 1];
    const { stream, handlers } = LangChainStream();
    const chat = new ChatOpenAI({
      // modelName: "gpt-4",
      modelName: "gpt-3.5-turbo",
      temperature: 0, // default is 1, range is 0 to 2
      // topP: 0.1, default is 1. openai does not recommend changing temperature and topP together.
      // timeout: 1000, put into baseOptions for openai and used for axios calls. axios timeout in ms and defaults to 0 (no timeout)
      maxRetries: 0,
      streaming: true,
      verbose: true,
    });
    chat.call(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanMessage(m.content)
          : m.role == "assistant"
          ? new AIMessage(m.content)
          : new SystemMessage(m.content)
      ),
      {},
      [handlers]
    );
    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : e }, { status: 500 });
  }
};
