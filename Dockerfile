FROM alpine
LABEL mantainer="Francesco Fattori f.fattori4@studenti.unipi.it"
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

#install essentials
RUN apk add go-ipfs
RUN apk add python3 py3-pip py3-setuptools

#IPFS init
RUN ipfs init

#copy IPFSDownloadAnalyzer files
RUN mkdir /app
COPY static /app/static
COPY templates /app/templates
COPY *.py /app
COPY *.txt /app
RUN mkdir /app/downloads

#install requirements
WORKDIR /app
RUN pip3 install -r requirements.txt

EXPOSE 5000
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]

