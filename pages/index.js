import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await fetch("/api/generateAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.answer);
      setQuestion("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
    setLoading(false); // End loading
  }

  return (
    <div>
      <Head>
        <title>Website Q&A</title>
        <link rel="icon" href="/qanda.png" />
      </Head>

      <main className={styles.main}>
        <img src="/qanda.png" className={styles.icon} />
        <h3>OpenAI Q&A Bot</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Enter a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input type="submit" value="Generate Answer" />
        </form>
        {loading && <div className={styles.spinner}></div>}
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
