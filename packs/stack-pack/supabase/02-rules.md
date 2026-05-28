## Stack Overlay - Supabase Rules

- 所有多表写入必须事务化。
- 涉及权限数据读取必须校验 RLS 策略变更影响。
