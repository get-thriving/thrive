FROM python:3.13.0
LABEL maintainer='horia141@gmail.com'

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y git curl netcat-openbsd libasound2-dev --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN curl --proto '=https' -LsSf https://astral.sh/uv/install.sh | sh
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.local/bin:/root/.cargo/bin:${PATH}"

WORKDIR /jupiter

ENV VIRTUAL_ENV=/jupiter/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="${VIRTUAL_ENV}/bin:${PATH}"

COPY LICENSE LICENSE
COPY pyproject.toml pyproject.toml
COPY uv.lock uv.lock
COPY src/Config.global src/Config.global
COPY src/docs/README.md src/docs/README.md
COPY src/docs/pyproject.toml src/docs/pyproject.toml
COPY src/docs/mkdocs.yml src/docs/mkdocs.yml
COPY src/docs/material src/docs/material
COPY assets/jupiter.ico src/docs/material/assets/favicon.ico
COPY assets/jupiter.png src/docs/material/assets/jupiter.png
COPY assets/showcase-*.png src/docs/material/assets/showcase/

RUN uv sync --all-packages --active

ARG PORT=8000
ENV HOST=0.0.0.0
ENV PORT=$PORT
ENV DEV_ADDR=$HOST:$PORT
EXPOSE $PORT

WORKDIR /jupiter/src/docs

ENTRYPOINT ["mkdocs", "serve", "--no-livereload"]
