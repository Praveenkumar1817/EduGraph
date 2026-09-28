import codecs

path = r'd:\Knowledge-Graph\frontend\src\pages\GraphPage.tsx'
with codecs.open(path, 'r', 'windows-1252', errors='replace') as f:
    content = f.read()

content = content.replace(r'id: \e-\-\\,', 'id: `e-${p.id}-${c.id}`,')
content = content.replace(r'axios.get(\/api/concepts/\/graph\);', 'axios.get(`/api/concepts/${node.id}/graph`);')
content = content.replace(r'<Link to={\/resources/\\}', '<Link to={`/resources/${r.id}`}')
content = content.replace(r'className={\px-3 py-1.5 rounded-md text-xs font-bold transition-all \${', 'className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${')

with codecs.open(path, 'w', 'utf-8') as f:
    f.write(content)
print("File fixed and converted to UTF-8.")
