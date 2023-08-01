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
      modelName: "gpt-3.5-turbo",
      temperature: 0,
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
