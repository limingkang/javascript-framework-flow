function flowJS(){
    var args = arguments,
        callee = arguments.callee,
        noop = function(){},
        flow = {init:noop},              //保存整个流程传递进来的对象
        flowData = {},                   //保存整个流程的整体共享数据
        init = 'init',           
        stepPath = ((args[1]||{}).constructor.toString() === Step.toString())?args[2]:'';   //保存子流程定义的键名
        callee.trace = callee.trace||[init];           //保存运行哪些流程的轨迹如['init','步骤A']
        callee.flow = callee.flow||{};                 //记住所有子流程所传参数对象
    if(({}).toString.call(args[0]) === '[object Object]'){
        extend(flow, args[0]);
        // 运行传递进来对象中的init方法
        flow.init.call(extend({getCurr:function(){
            return init;
        }, stepData:function(dataName){
            return dataName?undefined:{};
        }, getPrev:noop, fail:noop, success:noop, parent:stepPath?args[1]:null}, new Step(init)));
    }else if(typeof args[0] === 'string' && ({}).toString.call(args[1]) === '[object Object]'){
        if(({}).toString.call(callee.flow[args[0]]) !== '[object Object]'){
            callee.flow[args[0]] = args[1];
        }else{
            throw new Error("flow has been defined: " + args[0]);
        }
    }
    function Step(name){
        var nextStepName, nextData = {}, success = noop, fail = noop, nextStep, stepMapping = {};
        if(({}).toString.call(name) === '[object Array]'){
            // name传进并行运行的步骤名数组,当并行的所有方法运行完之后才开始下一大步骤
            // 默认stepMapping对象中所有步骤都为false即没执行
            for(var i=0;i<name.length;i++){
                stepMapping[name[i]] = false;
            }
        }else if(typeof name == 'string'){
            stepMapping[name] = false;
        }else{
			return this;
		}
        this.setNext = function(stepName, s, f){
            success = s||success;
            fail = f||fail;
            nextStepName = stepName||nextStepName;
            nextStep = new Step(nextStepName);
            return nextStep;
        };
        this.nextData = function(data){
            extend(nextData, data);
        };
        this.flowData = function(data){
            ({}).toString.call(data)==='[object Object]' && extend(flowData, data);
            return (typeof data=='string')?flowData[data]:flowData;
        };
        this.getNext = function(){
            return nextStepName;
        };
        this.next = function(stepName, s, f){
            nextStepName = stepName||nextStepName;
            success = s||success;
            fail = f||fail;
            nextStep = stepName?new Step(stepName):nextStep;
            if(nextStepName){
                nextStep.parent = this.parent;
                nextStep.stepData = function(dataName){
                    return dataName?nextData[dataName]:nextData;
                };
                nextStep.getPrev = function(){
                    return name;
                };
                nextStep.fail = function(){
                    fail.apply(this, arguments);
                };
                nextStep.success = function(){
                    success.apply(this, arguments);
                };
                stepMapping[this.getCurr()] = true;   //当前setNext中的步骤执行完成了
                //当一个setNext中的所有步骤（包括并行的）执行完成才执行下一setNext中步骤
                if(allDone()){
                    callee.trace = callee.trace.concat(join(stepPath, nextStepName));
                    typeof nextStepName == 'string' && proxy(nextStepName);
                    if(({}).toString.call(nextStepName) === '[object Array]'){
                        for(var i=0; i<nextStepName.length; i++){
                            proxy(nextStepName[i]);
                        }
                    }
                    function proxy(stepName, fn, parentPath){
                        fn = flow[stepName];
                        if(typeof fn === 'function'){
                            (function(fn, context){
                                return function(){
                                    return fn.apply(context, arguments);
                                };
                            })(fn, extend(new Step(), nextStep, {getCurr:function(){
								return stepName;
							}}))();
                        }else if(typeof fn === 'string' 
                        	|| ({}).toString.call(fn) === '[object Object]'){
                            parentPath = stepPath + stepName + '.';
                            callee.trace = callee.trace.concat(join(parentPath, init));
                            if(typeof fn === 'string'){
                                if(({}).toString.call(callee.flow[fn]) === '[object Object]'){
                                    callee.call(this, callee.flow[fn], 
                                    	extend(new Step(), nextStep, {
                                    		getCurr:function(){
												return stepName;
											}
										}
									), parentPath);
                                }else{
                                    throw new Error("flow not found: " + fn);
                                }
                            }else{
                                callee.call(this, fn, extend(new Step(), nextStep, {
                                	getCurr:function(){
										return stepName;
									}
								}), parentPath);
                            }
                        }else{
                            throw new Error("step not found: " + stepName);
                        }
                    }
                }
                return nextStep;
            }
        };
        function allDone(hasStep) {
            prop(stepMapping, function(p){
                hasStep = hasStep || !stepMapping[p];
            });
            return !hasStep;
        }
    }
    function join(par, tar){
        var temp = [];
        if(typeof tar == 'string'){
            temp = [par + tar];
        }else if(({}).toString.call(tar) === '[object Array]'){
            for(var i=0;i<tar.length;i++){
                temp.push(par+tar[i]);
            }
        }
        return temp;
    }
    function prop(obj, fun){
        for(var p in obj) {
            obj.hasOwnProperty(p) && fun(p);
        }
    }
    function extend(){
    	for(var i=1, arg0=arguments[0], arg; i<arguments.length,arg=arguments[i]; i++){
			prop(arg, function(p){
            	arg0[p] = arg[p];
        	});
    	}
        return arg0;
    }
}