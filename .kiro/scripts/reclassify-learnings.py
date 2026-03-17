#!/usr/bin/env python3
"""
Reclassify learnings: Move IDE/tooling learnings from local to global scope.
"""
import json
import re
from pathlib import Path

# Patterns that indicate IDE/tooling (should be global)
GLOBAL_PATTERNS = [
    r'PostToolUse',
    r'hook',
    r'reflection',
    r'silent observation',
    r'JSONL',
    r'\.jsonl',
    r'\.db extension',
    r'fsWrite',
    r'fsAppend',
    r'readFile',
    r'strReplace',
    r'executePwsh',
    r'git (config|commit|push|branch|remote)',
    r'Git (config|commit|push|branch|remote|Flow)',
    r'Backlog\.md',
    r'backlog',
    r'milestone',
    r'task creation',
    r'learning database',
    r'learnings\.jsonl',
    r'Graphviz',
    r'Mermaid',
    r'DOT format',
    r'diagram creation',
    r'spec creation',
    r'spec file structure',
    r'Spec (frontmatter|task structure|README)',
    r'MCP',
    r'file truncation',
    r'tool integration',
    r'smartRelocate',
    r'kiroPowers',
    r'discloseContext',
    r'skill activation',
]

# Patterns that indicate project-specific (should stay local)
LOCAL_PATTERNS = [
    r'Al-?Hayaat',
    r'migration plan',
    r'Component library.*45',
    r'Webflow',
    r'Next\.js',
    r'Azure Bicep',
    r'Phase \d',
    r'272 hours',
    r'admission\.html',
    r'button variants',
    r'typography variants',
    r'COMPONENT-LIBRARY-SPEC',
    r'MIGRATION-PLAN',
    r'alhayaat-school',
    r'Mohamed Jeafer',
]

def should_be_global(content: str) -> bool:
    """Determine if a learning should be global based on content."""
    # Check if it matches global patterns
    for pattern in GLOBAL_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            # Make sure it's not project-specific
            for local_pattern in LOCAL_PATTERNS:
                if re.search(local_pattern, content, re.IGNORECASE):
                    return False
            return True
    return False

def main():
    local_file = Path('.kiro-memory/learnings.jsonl')
    global_file = Path.home() / '.kiro' / 'learnings.jsonl'
    
    # Read local learnings
    with open(local_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    local_learnings = []
    global_learnings = []
    
    for line in lines:
        if not line.strip():
            continue
        
        try:
            learning = json.loads(line)
            content = learning.get('content', '')
            current_scope = learning.get('scope', 'local')
            
            # Determine correct scope
            if should_be_global(content):
                learning['scope'] = 'global'
                global_learnings.append(learning)
            else:
                learning['scope'] = 'local'
                local_learnings.append(learning)
                
        except json.JSONDecodeError:
            print(f"Skipping invalid JSON: {line[:50]}...")
            continue
    
    # Write reclassified learnings
    print(f"Reclassifying {len(lines)} learnings...")
    print(f"  → {len(global_learnings)} moving to global")
    print(f"  → {len(local_learnings)} staying local")
    
    # Backup original
    backup_file = local_file.with_suffix('.jsonl.backup')
    local_file.rename(backup_file)
    print(f"Backup created: {backup_file}")
    
    # Write local learnings
    with open(local_file, 'w', encoding='utf-8') as f:
        for learning in local_learnings:
            f.write(json.dumps(learning) + '\n')
    
    # Append to global learnings
    with open(global_file, 'a', encoding='utf-8') as f:
        for learning in global_learnings:
            f.write(json.dumps(learning) + '\n')
    
    print(f"\nReclassification complete!")
    print(f"Local: {local_file} ({len(local_learnings)} entries)")
    print(f"Global: {global_file} (appended {len(global_learnings)} entries)")

if __name__ == '__main__':
    main()
