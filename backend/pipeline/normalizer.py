"""
Text Normalizer, Alias Mapper, and Skill Lexicon Tokenizer.
"""

import re
from typing import Dict, List, Set, Tuple, Any

# Standard technical skill taxonomy & alias mapping
KNOWN_ALIASES: Dict[str, str] = {
    "react.js": "React",
    "reactjs": "React",
    "react": "React",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "node": "Node.js",
    "golang": "Go",
    "python3": "Python",
    "python": "Python",
    "java": "Java",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "js": "JavaScript",
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "docker": "Docker",
    "containerization": "Docker",
    "aws": "AWS",
    "amazon web services": "AWS",
    "gcp": "GCP",
    "google cloud": "GCP",
    "azure": "Azure",
    "sql": "SQL",
    "mysql": "SQL",
    "postgresql": "SQL",
    "postgres": "SQL",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "nosql": "NoSQL",
    "redis": "Redis",
    "graphql": "GraphQL",
    "rest": "REST API",
    "restful": "REST API",
    "rest api": "REST API",
    "git": "Git",
    "github": "Git",
    "gitlab": "Git",
    "ci/cd": "CI/CD",
    "cicd": "CI/CD",
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "ai": "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",
    "pytorch": "Machine Learning",
    "tensorflow": "Machine Learning",
    "scikit-learn": "Machine Learning",
    "pandas": "Data Analysis",
    "numpy": "Data Analysis",
    "data structures": "Data Structures",
    "algorithms": "Algorithms",
    "system design": "System Design",
    "microservices": "Microservices",
    "html": "HTML",
    "html5": "HTML",
    "css": "CSS",
    "css3": "CSS",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "vue": "Vue.js",
    "vuejs": "Vue.js",
    "angular": "Angular",
    "spring": "Spring Boot",
    "spring boot": "Spring Boot",
    "django": "Django",
    "flask": "Flask",
    "fastapi": "FastAPI",
    "kafka": "Apache Kafka",
    "spark": "Apache Spark",
    "linux": "Linux",
    "bash": "Bash"
}

SKILL_CATEGORIES: Dict[str, str] = {
    "Python": "Languages",
    "Java": "Languages",
    "JavaScript": "Languages",
    "TypeScript": "Languages",
    "Go": "Languages",
    "C++": "Languages",
    "C#": "Languages",
    "React": "Frontend",
    "Vue.js": "Frontend",
    "Angular": "Frontend",
    "HTML": "Frontend",
    "CSS": "Frontend",
    "Tailwind CSS": "Frontend",
    "Node.js": "Backend",
    "Django": "Backend",
    "Flask": "Backend",
    "FastAPI": "Backend",
    "Spring Boot": "Backend",
    "REST API": "Backend",
    "GraphQL": "Backend",
    "Microservices": "Architecture",
    "System Design": "Architecture",
    "AWS": "Cloud & DevOps",
    "GCP": "Cloud & DevOps",
    "Azure": "Cloud & DevOps",
    "Docker": "Cloud & DevOps",
    "Kubernetes": "Cloud & DevOps",
    "CI/CD": "Cloud & DevOps",
    "Linux": "Cloud & DevOps",
    "SQL": "Databases",
    "MongoDB": "Databases",
    "NoSQL": "Databases",
    "Redis": "Databases",
    "Git": "Tools",
    "Machine Learning": "AI / ML",
    "Deep Learning": "AI / ML",
    "Artificial Intelligence": "AI / ML",
    "Data Analysis": "Data Science",
    "Data Structures": "Core CS",
    "Algorithms": "Core CS"
}

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can", "can't", "cannot", "could",
    "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
    "during", "each", "few", "for", "from", "further", "had", "hadn't", "has",
    "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her",
    "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
    "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it",
    "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
    "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
    "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't",
    "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
    "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've",
    "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
    "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
    "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
    "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd",
    "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
    "experience", "years", "working", "knowledge", "proficient", "strong", "skills",
    "ability", "team", "development", "developer", "engineering", "engineer"
}


def normalize_token(token: str) -> str:
    """Cleans a single token and resolves known aliases."""
    clean = token.strip().lower()
    clean = re.sub(r'^[^\w\+#]+|[^\w\+#]+$', '', clean)
    return KNOWN_ALIASES.get(clean, clean.title() if len(clean) > 2 else clean.upper())


def extract_skills_and_tokens(text: str) -> Dict[str, Any]:
    """
    Extracts tokens, n-grams, and canonical skills from raw text.
    Returns normalized token list, skill occurrences, and alias mappings.
    """
    text_lower = text.lower()
    detected_skills = {}
    alias_replacements = []

    # Check multi-word aliases and phrases first
    sorted_aliases = sorted(KNOWN_ALIASES.keys(), key=lambda x: len(x), reverse=True)
    for alias in sorted_aliases:
        pattern = r'\b' + re.escape(alias) + r'\b'
        matches = list(re.finditer(pattern, text_lower))
        if matches:
            canonical = KNOWN_ALIASES[alias]
            count = len(matches)
            detected_skills[canonical] = detected_skills.get(canonical, 0) + count
            alias_replacements.append({
                "original": alias,
                "normalized": canonical,
                "occurrences": count,
                "category": SKILL_CATEGORIES.get(canonical, "General")
            })

    # Tokenize word-by-word
    raw_tokens = re.findall(r'[A-Za-z0-9\+#\./\-]+', text)
    filtered_tokens = []
    for tok in raw_tokens:
        tok_clean = tok.strip(".,;:()[]{}\"'").lower()
        if tok_clean and tok_clean not in STOPWORDS and len(tok_clean) > 1:
            filtered_tokens.append(tok_clean)

    return {
        "raw_token_count": len(raw_tokens),
        "filtered_tokens": filtered_tokens,
        "detected_skills": detected_skills,
        "alias_replacements": alias_replacements
    }
