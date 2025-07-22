<div align='center'>

# 🍇 Podo

> #### Podo: 매일을 칭찬으로 채우는 습관 앱

<!--
<div>
  <a href="https://apps.apple.com/us/app/indexly/id6740793736" target="_blank">
    <img src="https://github.com/user-attachments/assets/c170213c-044c-43b3-a464-2a1b4ba87855" height="40px" />
  </a>
  &nbsp;&nbsp;
  <a href="https://play.google.com/store/apps/details?id=com.janechun.indexly" target="_blank">
    <img src="https://github.com/user-attachments/assets/6fd1d380-afff-4bbc-be92-91ca2a3efe44" height="40px" />
  </a>
</div>
-->

<div display='flex'>
  <img src='https://github.com/user-attachments/assets/90229316-961b-46ae-be23-bb15b6d7bad7' width='220'/>
  <img src='https://github.com/user-attachments/assets/49999ca4-31a9-4482-9c3e-ae0e719d118a' width='220'/>
  <img src='https://github.com/user-attachments/assets/4b44e569-848e-44ba-836e-ee23a303c0bc' width='220'/>
  <img src='https://github.com/user-attachments/assets/de37bf45-8c62-494e-aeb6-e44557203531' width='220'/>
</div>
</div>
<br/>

<!-- <div align='center'> -->
  
## 💜 프로젝트 소개
>**칭찬 스티커, 습관이 되는 칭찬의 힘!**
><br/>
>『Podo』은 내가 실천한 행동을 **칭찬 스티커로 기록하고 보상**하는 앱이에요.

<!-- </div> -->

<br/>

**🍇 핵심 기능**
<br/>
- 나만의 미션을 설정하고, 실천할 때마다 하루 한 번 스티커 붙이기<br/>
- 캘린더로 결과를 한 눈에 확인할 수 있어요<br/>
- 간단하면서도 명확한 기록으로 성취감을 높이고 동기부여를 이어갈 수 있어요<br/>

<br/>

**✨ 『Podo』의 차별점**
<br/>
- 스티커는 **하루에 하나**만 붙일 수 있어요.<br/>
- 오늘 하지 않으면, 오늘의 스티커는 사라져요.<br/>
- 지나간 날짜에 몰아서 붙이거나, 미리 체크해두는 건 불가능해요.<br/>
- 기록보다 ‘오늘 실천하는 것’에 더 집중할 수 있도록 만들었어요.<br/>

<br/>

## 📆 개발 정보
- 개발자: JaneChun  
- 개발 기간: 2025년 7월 17일 ~ 7월 22일 (6일)

<br/>

## 🚀 기술 스택
- 프레임워크: React Native, Expo
- 네비게이션: React Navigation
- 빌드 도구: EAS Build
- 데이터베이스: SQLite
- 상태관리: Zustand

<br/>

## 📋 주요 기능
- 챌린지 생성 및 관리(CRUD)
  - 챌린지를 생성, 조회, 수정, 삭제할 수 있으며, 카드 형태 UI로 표시
  - 챌린지별 진행 현황 2가지 뷰 제공
 
- 스티커 드래그 앤 드롭 인터랙션
  - `LongPress`로 스티커 드래그 시작
  - 드래그된 스티커는 지정된 슬롯(회색 배경으로 시각화) 에만 드롭 가능
  - `measureInWindow()`를 활용해 좌표 기반으로 유효 슬롯 감지
  - `expo-haptics`를 활용해 스티커 부착/제거 시 햅틱 피드백 제공

- 스티커팩 선택 기능
  - `BottomSheetModal`을 사용해 다양한 스티커팩을 선택할 수 있는 UI 제공

- 칭찬 모달 및 파티클 애니메이션 피드백
  - 스티커 누적 개수에 따라 1, 3, 5, 10, ... 등의 마일스톤 달성 시 동적으로 칭찬 메시지 출력
  - 스티커판 완성 시, 이모지 파티클 애니메이션 + 연속 햅틱 피드백으로 사용자에게 즐거운 경험 제공

- 캘린더 기반 실천 기록 시각화
  - `react-native-calendars`의 dot, period 마커 기능으로 실천 기록을 시각화
  - 날짜 클릭 시 해당 날짜에 실천한 챌린지와 붙인 스티커 내역을 조회 가능

- 로컬 데이터 저장
  - 모든 데이터는 `expo-sqlite` 기반으로 로컬 데이터베이스에 저장
  - 서비스 로직은 `services/` 폴더에 도메인 단위로 캡슐화

<br/>

## 📷 스크린샷
<img src='https://github.com/user-attachments/assets/0babda4d-ca82-426c-b403-b05eac8cb2a4' width='500'/>

