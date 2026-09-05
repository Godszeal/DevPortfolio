#!/usr/bin/env python3
"""Validate the required DevPortfolio data.json structure without third-party dependencies."""
import json, sys
from pathlib import Path

path = Path(sys.argv[1] if len(sys.argv) > 1 else "data.json")
try:
    data = json.loads(path.read_text(encoding="utf-8"))
except Exception as exc:
    raise SystemExit(f"Invalid JSON: {exc}")

def require_object(key, parent=data):
    value = parent.get(key)
    if not isinstance(value, dict): raise SystemExit(f"{key} must be an object")
    return value
def require_array(key, parent=data):
    value = parent.get(key)
    if not isinstance(value, list): raise SystemExit(f"{key} must be an array")
    return value
def required(obj, *keys):
    missing = [key for key in keys if key not in obj]
    if missing: raise SystemExit(f"Missing required key(s): {', '.join(missing)}")

seo=require_object("seo"); required(seo,"siteTitle","siteDescription","author")
personal=require_object("personal"); required(personal,"name","role","email")
hero=require_object("hero"); required(hero,"greeting","typingRoles","bio","primaryCTA","secondaryCTA")
if not hero["typingRoles"] or not all(isinstance(x,str) for x in hero["typingRoles"]): raise SystemExit("hero.typingRoles must contain strings")
for cta in (hero["primaryCTA"],hero["secondaryCTA"]): required(cta,"label","href")
for key in ("stats","socials","education","testimonials","nav"): require_array(key) if key != "nav" else None
skills=require_object("skills"); categories=require_array("categories",skills)
for category in categories:
    required(category,"name","icon","items")
    for skill in category["items"]:
        required(skill,"name","level")
        if not isinstance(skill["level"],(int,float)) or not 0 <= skill["level"] <= 100: raise SystemExit(f"Skill level must be 0-100: {skill.get('name')}")
projects=require_object("projects"); require_array("items",projects)
for project in projects["items"]: required(project,"title","description","image","tech")
contact=require_object("contact"); form=contact.get("form",{})
if form and form.get("provider") not in ("formspree",None): raise SystemExit("contact.form.provider must be formspree or omitted")
ui=require_object("ui"); required(ui,"splashMessages","contactSubmitLabel")
print(f"Valid portfolio data: {path} ({len(projects['items'])} projects, {len(categories)} skill categories)")
