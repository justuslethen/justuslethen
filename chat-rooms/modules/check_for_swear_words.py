import re

def load_swear_words():
    try:
        with open("swear_words.txt", "r", encoding="utf-8") as file:
            words = set(re.split(r"[,\n]+", file.read().strip()))  # split at comma or newline
            return words if words else "" # return empty string if no words are found
    except FileNotFoundError:
        return "" # return empty string if file is missing

def censor(text, swear_words):
    # return original text if no swear words are given
    if not swear_words:
        return text, False

    # replace the swear word with *
    def censor_match(match):
        word = match.group()
        return "*" * len(word) if word.strip() else word  # Leerzeichen nicht ersetzen

    # first check for exact word matches
    pattern = re.compile(r"\b(" + "|".join(map(re.escape, swear_words)) + r")\b", re.IGNORECASE)
    censored_text, exact_censor_count = pattern.subn(censor_match, text)

    # second check for substrings inside words
    substring_pattern = re.compile("|".join(map(re.escape, swear_words)), re.IGNORECASE)
    censored_text, substring_censor_count = substring_pattern.subn(censor_match, censored_text)

    # return true if at least one swear word was found in either case
    was_censored = (exact_censor_count + substring_censor_count) > 0
    return censored_text, was_censored