# 빌드 스테이지
FROM gradle:8.3-jdk17 AS build
WORKDIR /app
COPY . /app/
RUN gradle build -x test --no-daemon

# 실행 스테이지
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# 환경 변수 설정 (개발 환경 프로필 활성화)
ENV SPRING_PROFILES_ACTIVE=dev

EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
