import sys
sys.stdout.reconfigure(encoding='utf-8')

content = open('src/components/MainDashboard.js', encoding='utf-8').read()
lines = content.split('\n')

# Find AnimatePresence closing tag
for i, line in enumerate(lines):
    if '</AnimatePresence>' in line:
        print(f'{i+1}: {lines[i][:100]}')
        # Show context
        for j in range(max(0,i-4), min(len(lines), i+3)):
            print(f'  {j+1}: {lines[j][:100]}')
        print('---')
