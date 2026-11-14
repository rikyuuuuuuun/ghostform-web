CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY CHECK(length(id)=32),
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  entry TEXT NOT NULL CHECK(entry IN ('home','trial')),
  source TEXT NOT NULL CHECK(source IN ('default','x','instagram','tiktok','note','coach')),
  mask INTEGER NOT NULL,
  qa INTEGER NOT NULL CHECK(qa IN (0,1)),
  shared INTEGER NOT NULL CHECK(shared IN (0,1))
);
CREATE INDEX IF NOT EXISTS visits_cohort ON visits(qa,first_seen);
CREATE INDEX IF NOT EXISTS visits_retention ON visits(last_seen);
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY,value TEXT NOT NULL);
INSERT OR IGNORE INTO meta VALUES ('active_since',CAST(strftime('%s','now')*1000 AS TEXT));
INSERT OR IGNORE INTO meta VALUES ('schema_version','1');
