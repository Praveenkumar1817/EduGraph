import codecs

path = r'd:\Knowledge-Graph\frontend\src\pages\GraphPage.tsx'
with codecs.open(path, 'r', 'utf-8', errors='replace') as f:
    content = f.read()

content = content.replace(r'className={\px-3 py-1.5 rounded-md text-xs font-bold transition-all \\}', 'className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterDomain === d ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700"}`}')

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)
print("File fixed.")
