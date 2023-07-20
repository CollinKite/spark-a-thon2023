FROM python

COPY requirements.txt .
RUN pip install -r requirements.txt 
ADD . .

CMD python Scripts/socketcontainer/manage.py runserver