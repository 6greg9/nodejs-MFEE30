(1)       

start
IIFE
end
timeout

Ans: stack 依序執行, setTimeout 在web Api 裡面等待時間到之後送cb 到task queue, 等到stack 空了才從queue送到stack
(2)      
start
IIFE
end
timeout
Ans: stack 依序執行, setTimeout 在web Api 裡面等待時間到之後送cb 到task queue, 等到stack 空了才從queue送到stack

(3)
foo
baz
bar
Ans: stack 依序執行

(4)       
foo
bar
baz
Ans: stack 依序執行, setTimeout 在web Api 裡面等待時間到之後送cb 到task queue, 等到stack 空了才從queue送到stack
