# =========================================================
# ESTÁGIO 1: Imagem base de Runtime (para rodar a API)
# =========================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# =========================================================
# ESTÁGIO 2: Build e Compilação com SDK completo
# =========================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o csproj e restaura as dependências (otimiza o cache de build)
COPY ["Stage-API.csproj", "./"]
RUN dotnet restore "Stage-API.csproj"

# Copia todo o código fonte e compila
COPY . .
RUN dotnet build "Stage-API.csproj" -c Release -o /app/build

# =========================================================
# ESTÁGIO 3: Publicação dos artefatos
# =========================================================
FROM build AS publish
RUN dotnet publish "Stage-API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# =========================================================
# ESTÁGIO 4: Imagem final enxuta
# =========================================================
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Stage-API.dll"]