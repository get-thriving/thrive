#!/usr/bin/env python3
"""Rename Project -> Project throughout the codebase."""

import os
import sys
from pathlib import Path

# Ordered replacements: most specific first within each case style
CONTENT_REPLACEMENTS = [
    # PascalCase - compounds first
    ("ProjectMilestone", "ProjectMilestone"),
    ("ProjectCollection", "ProjectCollection"),
    ("ProjectStats", "ProjectStats"),
    ("ProjectStatus", "ProjectStatus"),
    ("ProjectName", "ProjectName"),
    ("ProjectSummary", "ProjectSummary"),
    ("WorkableProject", "WorkableProject"),
    ("PerProjectBreakdown", "PerProjectBreakdown"),
    # PascalCase - general
    ("Projects", "Projects"),
    ("Project", "Project"),
    # snake_case - compounds first
    ("project_milestone", "project_milestone"),
    ("project_collection", "project_collection"),
    ("project_stats", "project_stats"),
    ("project_status", "project_status"),
    ("project_name", "project_name"),
    ("project_ref_id", "project_ref_id"),
    ("project_cnt", "project_cnt"),
    # snake_case - general
    ("projects", "projects"),
    ("project", "project"),
    # UPPER_CASE
    ("PROJECTS", "PROJECTS"),
    ("PROJECT", "PROJECT"),
    # hyphenated
    ("projects", "projects"),
    ("project", "project"),
    # Title Case display text
    ("Projects", "Projects"),
    ("Project", "Project"),
    # lowercase display text
    ("projects", "projects"),
    ("project", "project"),
]

# Same replacements applied to filenames/dirnames
NAME_REPLACEMENTS = [
    ("ProjectMilestone", "ProjectMilestone"),
    ("ProjectCollection", "ProjectCollection"),
    ("ProjectStats", "ProjectStats"),
    ("ProjectStatus", "ProjectStatus"),
    ("ProjectName", "ProjectName"),
    ("ProjectSummary", "ProjectSummary"),
    ("WorkableProject", "WorkableProject"),
    ("PerProjectBreakdown", "PerProjectBreakdown"),
    ("Projects", "Projects"),
    ("Project", "Project"),
    ("project_milestone", "project_milestone"),
    ("project_collection", "project_collection"),
    ("project_stats", "project_stats"),
    ("project_status", "project_status"),
    ("project_name", "project_name"),
    ("project_ref_id", "project_ref_id"),
    ("project_cnt", "project_cnt"),
    ("projects", "projects"),
    ("project", "project"),
    ("projects", "projects"),
    ("project", "project"),
]

SKIP_DIRS = {".git", "__pycache__", ".mypy_cache", "node_modules", ".next", ".cache"}
SKIP_EXTS = {".pyc", ".pyo", ".so", ".dylib", ".dll", ".o", ".a", ".class"}


def should_skip_path(path: str) -> bool:
    parts = Path(path).parts
    return any(p in SKIP_DIRS for p in parts)


def apply_replacements(text: str, replacements: list) -> str:
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def process_file_content(filepath: str) -> bool:
    ext = Path(filepath).suffix.lower()
    if ext in SKIP_EXTS:
        return False
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            original = f.read()
    except (IOError, OSError, PermissionError):
        return False

    updated = apply_replacements(original, CONTENT_REPLACEMENTS)
    if updated == original:
        return False

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(updated)
    return True


def rename_path(old_path: str) -> str | None:
    name = os.path.basename(old_path)
    new_name = apply_replacements(name, NAME_REPLACEMENTS)
    if new_name == name:
        return None
    parent = os.path.dirname(old_path)
    new_path = os.path.join(parent, new_name)
    os.rename(old_path, new_path)
    return new_path


def main():
    root = "/home/user/thrive"
    content_changed = 0
    files_renamed = 0
    dirs_renamed = 0

    print("Phase 1: Updating file contents...")
    for dirpath, dirnames, filenames in os.walk(root, topdown=True):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        if should_skip_path(dirpath):
            continue
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            if process_file_content(filepath):
                content_changed += 1
                print(f"  content: {filepath}")

    print(f"\nPhase 1 done: {content_changed} files updated")

    print("\nPhase 2: Renaming files...")
    # Collect all files to rename first, then rename bottom-up
    files_to_rename = []
    for dirpath, dirnames, filenames in os.walk(root, topdown=True):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        if should_skip_path(dirpath):
            continue
        for filename in filenames:
            new_name = apply_replacements(filename, NAME_REPLACEMENTS)
            if new_name != filename:
                files_to_rename.append(os.path.join(dirpath, filename))

    for filepath in files_to_rename:
        new_path = rename_path(filepath)
        if new_path:
            files_renamed += 1
            print(f"  file: {filepath} -> {os.path.basename(new_path)}")

    print(f"\nPhase 2 done: {files_renamed} files renamed")

    print("\nPhase 3: Renaming directories (bottom-up)...")
    # Collect all dirs with project in name, sorted deepest first
    dirs_to_rename = []
    for dirpath, dirnames, filenames in os.walk(root, topdown=False):
        if should_skip_path(dirpath):
            continue
        dirname = os.path.basename(dirpath)
        new_dirname = apply_replacements(dirname, NAME_REPLACEMENTS)
        if new_dirname != dirname:
            dirs_to_rename.append(dirpath)

    for dirpath in dirs_to_rename:
        new_path = rename_path(dirpath)
        if new_path:
            dirs_renamed += 1
            print(f"  dir: {dirpath} -> {os.path.basename(new_path)}")

    print(f"\nPhase 3 done: {dirs_renamed} directories renamed")
    print(f"\nTotal: {content_changed} files updated, {files_renamed} files renamed, {dirs_renamed} dirs renamed")


if __name__ == "__main__":
    main()
