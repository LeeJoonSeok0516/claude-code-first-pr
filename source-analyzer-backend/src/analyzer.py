import os
import re
from pathlib import Path
from typing import List, Dict, Set
from uuid import uuid4
import json

class SourceAnalyzer:
    def __init__(self):
        self.supported_extensions = {'.java', '.jsp', '.xml'}
        self.functions = []
        self.tables = set()
        self.visited_files = set()

    def analyze_directory(self, root_path: str) -> Dict:
        self.visited_files = set()
        self.functions = []
        self.tables = set()

        results = {
            'id': str(uuid4()),
            'root_path': root_path,
            'functions': [],
            'tables': [],
            'files_analyzed': 0,
            'status': 'analyzing'
        }

        try:
            files = self._get_source_files(root_path)
            results['files_analyzed'] = len(files)

            for file_path in files:
                self._analyze_file(file_path)

            results['functions'] = self.functions[:50]
            results['tables'] = sorted(list(self.tables))
            results['status'] = 'completed'
        except Exception as e:
            results['status'] = 'error'
            results['error'] = str(e)

        return results

    def _get_source_files(self, root_path: str) -> List[str]:
        files = []
        try:
            for root, dirs, filenames in os.walk(root_path):
                for filename in filenames:
                    if any(filename.endswith(ext) for ext in self.supported_extensions):
                        file_path = os.path.join(root, filename)
                        files.append(file_path)
        except Exception:
            pass
        return files

    def _analyze_file(self, file_path: str):
        if file_path in self.visited_files:
            return
        self.visited_files.add(file_path)

        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

                if file_path.endswith('.java'):
                    self._analyze_java(content, file_path)
                elif file_path.endswith('.jsp'):
                    self._analyze_jsp(content, file_path)
                elif file_path.endswith('.xml'):
                    self._analyze_xml(content, file_path)
        except Exception:
            pass

    def _analyze_java(self, content: str, file_path: str):
        class_pattern = r'(?:public\s+)?(?:class|interface)\s+(\w+)'
        method_pattern = r'(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\('

        classes = re.findall(class_pattern, content)
        methods = re.findall(method_pattern, content)

        for cls in classes:
            self.functions.append({
                'type': 'class',
                'name': cls,
                'file': Path(file_path).name,
                'language': 'Java'
            })

        for method in methods:
            self.functions.append({
                'type': 'method',
                'name': method,
                'file': Path(file_path).name,
                'language': 'Java'
            })

    def _analyze_jsp(self, content: str, file_path: str):
        var_pattern = r'var\s+(\w+)\s*='
        function_pattern = r'function\s+(\w+)\s*\('

        variables = re.findall(var_pattern, content)
        functions = re.findall(function_pattern, content)

        for var in variables[:5]:
            self.functions.append({
                'type': 'variable',
                'name': var,
                'file': Path(file_path).name,
                'language': 'JSP'
            })

        for func in functions:
            self.functions.append({
                'type': 'function',
                'name': func,
                'file': Path(file_path).name,
                'language': 'JSP'
            })

    def _analyze_xml(self, content: str, file_path: str):
        table_pattern = r'<\s*(\w+)[^>]*>'

        elements = re.findall(table_pattern, content)
        for elem in elements[:10]:
            if elem not in ['!DOCTYPE', '?xml', 'beans']:
                self.tables.add(elem)
