# About

其实流的思想在前端开发端很常见，无论是rxjs还是promise对象中都有一个流的思想，当代码在运行的时候，其实跟我们做事情是
做完一步接着下一步，并且这些事情有些是可规划的，有些是需要做完该步才知道下一步该做什么，运用流的思想在开发中就能让
代码看起来更加语义化和流程化，使得代码更具可读性


# API INTRODUCTION

1、可以预先规划好流程的每一步，如this.setNext('步骤A').setNext('步骤B')，[参见demo1.html](./demo1.html)

2、可以在任何一步决定下一步做什么，如 this.setNext('步骤C')，[参见demo2.html](./demo2.html)

3、在任何一步中，可以知道当前步是在做什么，前面一步做了什么、下一步准备要做什么，如this.getCurr()、this.getPrev()、this.getNext()，[参见demo3.html](./demo3.html)

4、当前步做完后，能将结果告诉下一步（仅仅是下一步能获取到当前步传递的结果，也就是为了保护变量污染，
每一步都只能获取到前一步的结果），如给下一步传值this.nextData({name1:value1,name2:value2,……})、获
取上一步传来的值this.stepData(name1)或this.stepData()，[参见demo4.html](./demo4.html)

5、可以设置或获取整个流程的全局变量，这样所有的步骤都能共享该变量，如 设置全局变量值this.flowData({name1:value1,name2:value2,……})，
获取全局变量值this.flowData(name1)或this.flowData()，每个子流程都有自己的全局变量互不干扰，[参见demo5.html](./demo5.html)

6、上一步可以知道当前步的执行结果，成功 or 失败，如 在上一步中设置this.setNext('步骤B', successFun, failFun)、当前步中通过
this.success(args)、this.fail(args)来告诉上一步，[参见demo6.html](./demo6.html)

7、当前步可以随时通知下一步开始执行，如this.next()，[参见demo7.html](./demo7.html)

8、有些步骤能并行执行，并且要都执行完才能执行下一步，如 this.setNext('步骤A').setNext([步骤B1,步骤B2,步骤B3]).setNext('步骤C')，[参见demo8.html](./demo8.html)

9、可以在任何时候知道当前代码流程运行过的轨迹，如flowJS.trace，这对于了解页面的执行过程会比较有帮助，[参见demo9.html](./demo9.html)

10、最简单的子流程使用方法，[参见demo10.html](./demo10.html)

11、子流程和父流程 通过 this.parent 进行交互，[参见demo11.html](./demo11.html)

12、多个子流程并行执行，[参见demo12.html](./demo12.html)

13、定义子流程和引用子流程，[参见demo13.html](./demo13.html)
