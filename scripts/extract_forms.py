from html.parser import HTMLParser

class FormParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inputs = []
        self.labels = []
        self._in_label = False
        self._label_text = ''
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag in ['input','textarea','select']:
            self.inputs.append({
                'type': d.get('type', tag),
                'name': d.get('name',''),
                'placeholder': d.get('placeholder',''),
                'required': 'required' in d
            })
        if tag == 'label':
            self._in_label = True
            self._label_text = ''
    def handle_data(self, data):
        if self._in_label:
            self._label_text += data
    def handle_endtag(self, tag):
        if tag == 'label':
            self._in_label = False
            t = self._label_text.strip()
            if t:
                self.labels.append(t)

pages = ['contact.html','application.html','careers.html','donate.html']
for p in pages:
    try:
        with open(f'al-hayaat.webflow/{p}', encoding='utf-8') as f:
            content = f.read()
        parser = FormParser()
        parser.feed(content)
        print(f'\n=== {p} ===')
        for i in parser.inputs:
            print(f'  INPUT  name={i["name"]} type={i["type"]} placeholder={i["placeholder"]} required={i["required"]}')
        for l in parser.labels:
            print(f'  LABEL  {l}')
    except Exception as e:
        print(f'{p}: ERROR {e}')
