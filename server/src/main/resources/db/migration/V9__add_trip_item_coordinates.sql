-- 경로 최적화를 위한 방문 장소 좌표(위/경도). 기존 항목은 null 허용.
alter table trip_item
    add column latitude  double precision,
    add column longitude double precision;
