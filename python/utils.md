```python

# create whl 
python setup.py sdist bdist_wheel

python -m twine upload --repository-url https://nexus.xx.ru/repository/pypi-private/ dist/*

```
