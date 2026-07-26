# GTM + GA4 분석 설정

이 프로젝트는 화면 컴포넌트에서 Google Analytics를 직접 호출하지 않습니다.
업무 이벤트를 `src/lib/analytics.ts`의 `trackAnalyticsEvent()`로 `dataLayer`에 전달하고,
Google Tag Manager가 이를 GA4로 전송합니다.

## 1. 환경변수

`.env.example`을 참고해 로컬 `.env`를 만듭니다.

```dotenv
VITE_GTM_ID=GTM-XXXXXXX
VITE_ANALYTICS_ENVIRONMENT=prototype
VITE_ANALYTICS_DEBUG=true
```

- `VITE_GTM_ID`: GTM 웹 컨테이너 ID입니다. 형식이 올바르지 않거나 값이 없으면 GTM을 로드하지 않습니다.
- `VITE_ANALYTICS_ENVIRONMENT`: `prototype`, `staging`, `production`처럼 데이터 출처를 구분합니다.
- `VITE_ANALYTICS_DEBUG`: `true`이면 브라우저 콘솔에서 전송 직전 메시지를 확인할 수 있습니다.

GTM과 GA4 측정 ID는 공개 식별자지만, 환경별 설정이 섞이지 않도록 `.env`는 Git에 커밋하지 않습니다.

## 2. 현재 이벤트 계약

모든 이벤트에는 `app_environment`와 `analytics_schema_version`이 자동으로 추가됩니다.

| 이벤트                          | 발생 시점                                    | 주요 파라미터                                        |
| ------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `page_view`                     | 최초 진입 및 SPA 라우트 전환                 | `page_path`, `page_title`, `user_role`               |
| `role_selected`                 | 첫 화면에서 지원자/공연사 선택               | `user_role`, `entry_point`                           |
| `show_detail_viewed`            | 지원자가 공연 상세 확인                      | `show_id`, `show_status`, `has_existing_application` |
| `application_started`           | 지원서 작성 화면 진입                        | `show_id`, `required_item_count`                     |
| `application_step_completed`    | 필수값을 채우고 다음 단계 이동               | `show_id`, `step_number`, `step_name`                |
| `application_validation_failed` | 누락된 필수값이 있는 상태에서 다음 단계 시도 | `show_id`, `step_number`, `missing_required_count`   |
| `application_submitted`         | 지원 데이터 저장 성공 후                     | `show_id`와 선택 자료 개수                           |
| `recruitment_create_started`    | 공연사가 공고 작성 화면 진입                 | `entry_point`                                        |
| `recruitment_previewed`         | 작성 중인 공고 미리보기 열기                 | 배역·제출 항목·질문 개수                             |
| `applicant_detail_viewed`       | 공연사가 지원자 상세 확인                    | `show_id`, `review_status`                           |
| `review_status_changed`         | 지원자의 검토 상태 변경 성공                 | 이전/새 검토 상태                                    |

이름, 이메일, 전화번호, 자유 입력 답변, 내부 메모, 파일명은 분석 이벤트로 보내지 않습니다.

## 3. GTM 컨테이너 설정

1. GTM에서 웹 컨테이너를 생성합니다.
2. GA4 프로토타입 Property와 웹 데이터 스트림을 생성합니다.
3. GTM에 `Google 태그`를 추가하고 GA4의 `G-...` 측정 ID를 연결합니다.
4. Google 태그는 `Initialization - All Pages`에서 실행합니다.
5. 이 프로젝트가 `page_view`를 직접 전송하므로 자동 페이지뷰 전송은 끕니다.
6. GA4 웹 스트림의 향상된 측정에서 브라우저 기록 변경 기반 페이지뷰도 중복되지 않게 끕니다.
7. 사용자 정의 이벤트 트리거를 만들고 다음 정규식으로 이벤트를 제한합니다.

```regex
^(page_view|role_selected|show_detail_viewed|application_started|application_step_completed|application_validation_failed|application_submitted|recruitment_create_started|recruitment_previewed|applicant_detail_viewed|review_status_changed)$
```

8. `Google 애널리틱스: GA4 이벤트` 태그를 만들고 이벤트 이름에 GTM 기본 변수 `{{Event}}`를 사용합니다.
9. 표에 있는 파라미터를 데이터 영역 변수로 만들고 동일한 이름의 GA4 이벤트 파라미터로 전달합니다.
10. GTM Preview와 GA4 DebugView에서 확인한 다음 컨테이너 버전을 게시합니다.

`application_submitted`는 GA4에서 핵심 이벤트로 지정합니다. 현재 프로토타입에는 공고 등록 완료 기능이 없으므로 `recruitment_created` 이벤트는 아직 정의하지 않습니다.

## 4. 프로토타입에서 운영으로 이동

- 이벤트 이름과 파라미터 계약은 그대로 유지합니다.
- 운영용 GA4 Property를 별도로 생성해 프로토타입 데이터와 분리합니다.
- 배포 환경의 `VITE_GTM_ID`와 `VITE_ANALYTICS_ENVIRONMENT`만 운영 값으로 바꿉니다.
- 실제 백엔드가 생기면 제출/상태 변경 이벤트는 버튼 클릭이 아니라 API 성공 응답 뒤에 발생시킵니다.
- 이벤트 계약이 바뀌면 `analytics_schema_version`을 올리고 문서를 함께 수정합니다.
