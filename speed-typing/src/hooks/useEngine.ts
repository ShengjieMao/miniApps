import { useCallback, useEffect, useState } from "react";
import useWords from "./useWords";
import useCountdownTimer from "./useCountdownTimer";
import useTypings from "./useTypings";
import { countErrors } from "../utils/helpers";

export type State = "start" | "run" | "finish";

// constants define
const NUMBER_OF_WORDS = 12;
const COUNTDOWN_SECONDS = 30

const useEngine = () => {
    const [state, setState] = useState<State>("start");
    const { words, updateWords } = useWords(NUMBER_OF_WORDS);
    const { timeLeft, startCountdown, resetCountdown } = useCountdownTimer(COUNTDOWN_SECONDS);
    const { typed, cursor, clearTyped, resetTotalTyped, totalTyped } = useTypings(state !== "finish");
    const [errors, setErrors] = useState(0);

    const isStarting = state === "start" && cursor > 0;
    const areWordsFinished = cursor === words.length;

    const sumErrors = useCallback(() => {
        const wordsReached = words.substring(0, cursor);
        setErrors((prevErrors) => prevErrors + countErrors(typed, wordsReached));
    }, [typed, words, cursor]);

    // start timer as user type in
    useEffect(() => {
        if (isStarting) {
            setState("run");
            startCountdown();
        }
    }, [isStarting, startCountdown, cursor]);

    // end game when time up
    useEffect(() => {
        if (!timeLeft) {
            console.log("time up");
            setState("finish");
            sumErrors();
        }
    }, [timeLeft, sumErrors]);

    // refresh words when finish a page before time up
    useEffect(() => {
        if (areWordsFinished) {
            console.log("continue to next list");
            sumErrors();
            updateWords();
            clearTyped();
        }
    }, [
        cursor,
        words,
        clearTyped,
        typed,
        areWordsFinished,
        updateWords,
        sumErrors,
    ]);

    // restart button
    const restart = useCallback(() => {
        console.log("restart");
        resetCountdown();
        resetTotalTyped();
        setState("start");
        setErrors(0);
        updateWords();
        clearTyped();
    }, [clearTyped, updateWords, resetCountdown, resetTotalTyped]);

    return { state, words, timeLeft, typed, errors, totalTyped, restart };
}

export default useEngine;