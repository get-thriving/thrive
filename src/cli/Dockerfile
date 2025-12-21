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
COPY src/alib/py/framework src/alib/py/framework
COPY src/alib/py/framework/pyproject.toml src/alib/py/framework/pyproject.toml
COPY src/alib/py/framework/jupiter src/alib/py/framework/jupiter
COPY src/core/README.md src/core/README.md
COPY src/core/pyproject.toml src/core/pyproject.toml
COPY src/core/migrations src/core/migrations
COPY src/core/jupiter src/core/jupiter
COPY src/cli/README.md src/cli/README.md
COPY src/cli/pyproject.toml src/cli/pyproject.toml
COPY src/cli/Config.project.live src/cli/Config.project
COPY src/cli/jupiter src/cli/jupiter

RUN uv sync --all-packages --active

WORKDIR /jupiter/src/cli

ENTRYPOINT ["python", "-m", "jupiter.cli.jupiter"]
