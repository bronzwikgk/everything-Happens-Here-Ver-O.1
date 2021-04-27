/**
 * @type RequestObj
 */
 var getElement = {
    reqName: "getElement", //CommanName
    objectModel: document,
    method: "getElementById",
    arguments: ["test"],
};

/**
* @type RequestObj
*/
var singleReq = {
    reqName: "singleReq",
    objectModel: document,
    method: "getElementById",
    arguments: ["test"],
    callBack: "convertToJSON",
};

/**
* @type RequestObj
*/
var convertToJSON = {
    objectModel: DOMConversion,
    method: "toJSON",
    arguments: ["fromPrevious", entityModel4Html],
};

/**
 * @type RequestObj
 */
var displayJSON = {
    objectModel: DOMConversion,
    method: "displayDOMJSON",
    arguments: ["fromPrevious"],
};

/**
 * @type {FlowRequest}
 */
var actionFlowModelReq = {
    flowRequest: [
        {
            reqName: "convertElementToJSON",
            objectModel: document,
            method: "getElementById",
            arguments: ["test"],
            callBack: "convertToJSON",
        },
        {
            reqName: "saveElementToLocalStorage",
            objectModel: Storage,
            method: "saveToLocalStorage",
            arguments: ["domJSON", "convertElementToJSON"],
        },
        {
            reqName: "displaySavedElement",
            objectModel: Storage,
            method: "getFromLocalStorage",
            arguments: ["domJSON"],
            callBack: "displayJSON"
        },
    ],
};

/**
 * @type {RequestObj}
 */
var nestedFlowModelReq = {
    reqName: "convertElementToJSON",
    objectModel: document,
    method: "getElementById",
    arguments: ["test"],
    callBack: "convertToJSON",
    andThen: {
        reqName: "saveElementToLocalStorage",
        objectModel: Storage,
        method: "saveToLocalStorage",
        arguments: ["domJSON", "convertElementToJSON"],
        andThen: {
            reqName: "displaySavedElement",
            objectModel: Storage,
            method: "getFromLocalStorage",
            arguments: ["domJSON"],
            callBack: "displayJSON"
        },
    },
};

var setInnerHTML = {
    reqName: "getFirstElement",
    objectModel: document,
    method: "getElementById",
    arguments: ["first"],
    andThen: {
        reqName: "addSecondToFirst",
        objectModel: DOMConversion,
        method: "addInnerHTML",
        arguments: ["getFirstElement", "<div>I am nested</div>"],
    }
};
//New File Flow - 1.get Editor element 2.get a uid 3.Assign it to editor's fileid,4.Change the content of editor
var newFileFlowRequest = {
     flowRequest:[
    {
        reqName: "Editor",
        objectModel: document,
        method: "getElementById",
        arguments: ["inlineContent"],
    },{
        reqName:'UID',
        objectModel:processFS,
        method:'uid'
    },{
        reqName:"fileID_File",//2
        objectModel:'Editor',
        method:'setAttribute',
        arguments:['fileid','UID']
    },{
        reqName: "NewActionStory",
        objectModel: ActionView,
        method: "addInnerHTML",
        arguments: [ehhIntro,"Editor"],
    }
    ]
}
//save file Flow -  1.get Editor element 2.get FileID from editor attribute 3.getInnerText of editor 4.get file handle from indexDB
//5. check whether result of (4.) length greater than 0 and stores it in localStorage(new actionStory) 6.create writable 7.update innerText of file using FS8.close writable
var saveFileFlowRequest = {
    flowRequest:[
    {

        reqName:'Editor',//1
        objectModel: document,
        method: "getElementById",
        arguments: ["inlineContent"],
    },
    {
        reqName:"fileID_File",//2
        objectModel:'Editor',
        method:'getAttribute',
        arguments:['fileid']
    },
    {
        validate:{
            objectModel:operate,
            method:'isEqual',
            arguments:['fileID_File.length',0],
            output:false,
        },
        reqName:"FileHandleFromIndexDB",//4
        objectModel:indexDB,
        method:'get',
        arguments:["fileID_File"],
        exitBeforeExecutingRequest:true
    },
    {
        reqName:"getInnerText",//3
        objectModel:document,
        method: "getElementById",
        arguments: ["inlineContent"],
        andThen:['innerText']
    },
    {
        validate:{
            objectModel:operate,
            method:'isNotEmpty',
            arguments:['FileHandleFromIndexDB'],
            output:false
        },
        reqName:'LocalStorage',//5
        objectModel:localStorage,
        method:'setItem',
        arguments:['fileID_File','getInnerText'],
        exitAfterExecutingRequest:true
    },
    {
        reqName:"Writable",//6
        objectModel:"FileHandleFromIndexDB",
        method:"createWritable",
    },
    {
        reqName:"writeinFile",//7
        objectModel:"Writable",
        method:'write',
        arguments:['getInnerText']
    },
    {
        reqName:"closeWritable",//8
        objectModel:"Writable",
        method:'close'
    },
    ]
}
//Open a File Flow -1.Show file Picker 2.Generate a uid 3.Set that uid to fileHandle 4. make a file entry in myFiles 5.,open in the editor
var OpenAFileFlowRequest ={
    flowRequest:[
        {
            reqName:'GetAFile',
            objectModel:window,
            method:'showOpenFilePicker',
            andThen:["0"]
        },
        {
            reqName:'UID',
            objectModel:processFS,
            method:'uid'
        },
        {
            reqName:'FileHandleToFileID',
            objectModel:indexDB,
            method:'set',
            arguments:["UID","GetAFile"]
        },
        {
            reqName:'GetFileHandleToFileID',
            objectModel:indexDB,
            method:'get',
            arguments:["UID"]
        },
        // {
        //     reqName:'jsonForFile',
        //     objectModel:processFS,
        //     method:'jsonForFile',
        //     arguments:["UID","myFiles","GetAFile"]
        // },
        {
            reqName:'SetUIDToFileJSON',
            objectModel:engine,
            method:'set',
            arguments:[fileJSON,"UID","id",]
        },
        {
           reqName:"SetNameToLocalStorageFile",
            validate:{
                objectModel:operate,
                method:'isNotEmpty',
                arguments:["GetAFile"],
                output:false
            },
            objectModel:engine,
            method:'set',
            arguments:[fileJSON,"UID","textContent"]
        },
        {
            reqName:'file',
            validate:{
                objectModel:operate,
                method:'isNotEmpty',
                arguments:["GetAFile"],
                output:true
            },
            objectModel:"GetAFile",
            method:'getFile'
        },
        {
            reqName:'SetNameToFSFile',
            validate:{
                objectModel:operate,
                method:'isNotEmpty',
                arguments:["GetAFile"],
                output:true
            },
            objectModel:engine,
            method:'set',
            arguments:[fileJSON,"file.name","textContent"]
        },
        {
            reqName:"StringifyJSON",
            objectModel:JSON,
            method:'stringify',
            arguments:[{}]
        },
        {
            reqName:"ParseJSON",
            objectModel:JSON,
            method:'parse',
            arguments:["StringifyJSON"]
        },
        {
            reqName:'input',
            objectModel:engine,
            method:'set',
            arguments:["ParseJSON",fileJSON,"UID"]
        },
        {
            reqName:"myFilesElement",
            objectModel:document,
            method:'getElementById',
            arguments:['myFiles']
        },
        {
            reqName:"newEntity",
            objectModel:ActionView,
            method:'newEntity',
            arguments:['input',"myFilesElement"]
        },
        {
            reqName:'SetUsermyFilesLocalStorage',
            objectModel:localStorage,
            method:'setItem',
            arguments:['UsermyFiles',"myFilesElement.innerHTML"]
        },
        {
            reqName:'Editor',
            objectModel:document,
            method:'getElementById',
            arguments:['inlineContent'],
            callBack:{  method:'setAttribute',arguments:['fileid','UID']}
        },
        {
            reqName:"FileInEditor",
            objectModel:processFS,
            method:'OpenFileInEditor',
            arguments:['UID']
        },
    ]
}
var OpenADirectoryRequest = {
    flowRequest:[
        {
            reqName:'DirectoryHandle',
            objectModel:window,
            method:'showDirectoryPicker',
           // andThen:["0"]
        },
        {
            reqName:"TakeUserPermissionsandGetUID",
            validate:{
                objectModel:processFS,
                method:'verifyPermission',
                arguments:['DirectoryHandle',true],
                output:true
            },
            exitBeforeExecutingRequest:true,
            objectModel:processFS,
            method:'uid'
        },
        {
            reqName:'FileHandleToFileID',
            objectModel:indexDB,
            method:'set',
            arguments:["TakeUserPermissionsandGetUID",'DirectoryHandle']
        },
        {
            reqName:'StringifyDirectoryJSON',
            objectModel:JSON,
            method:'stringify',
            arguments:[directoryJSON]
        },
        {
            reqName:'input',
            objectModel:JSON,
            method:'parse',
            arguments:['StringifyDirectoryJSON']
        },
        {
            reqName:'DirHandleName',
            objectModel:engine,
            method:'set',
            arguments:['input.li.span','DirectoryHandle.name','textContent']
        },
        {
            reqName:"DirHandleId",
            objectModel:engine,
            method:'set',
            arguments:["input.li.list","TakeUserPermissionsandGetUID",'id']
        },
        {
            reqName:"jsonForDirectory",
            objectModel:processFS,
            method:'jsonForDirectory',
            arguments:['input.li.list','DirectoryHandle']
        },
        {
            reqName:'CollectionElement',
            objectModel:document,
            method:'getElementById',
            arguments:['myCollection']
        },
        {
            reqName:'newEntity',
            objectModel:ActionView,
            method:'newEntity',
            //new Entity
            arguments:['input','CollectionElement']
        },
        {
            reqName:'SetUsermyCollection',
            objectModel:localStorage,
            method:'setItem',
            arguments:['UsermyCollection','CollectionElement.innerHTML']
        }
    ]
}
//json for Directory
var jsonForDirectory_Directory = {
    flowRequest:[
        {
            reqName:"UID",
            objectModel:processFS,
            method:'uid'
        },
        {
            validate:{
                objectModel:operate,
                method:'isEqual',
                arguments:['entry.kind','directory'],
                output:true
            },
            reqName:"Stringify",
            objectModel:JSON,
            method:'stringify',
            arguments:[directoryJSON],
            exitBeforeExecutingRequest:true,
        },
        {
            reqName:"Directory",
            objectModel:JSON,
            method:'Parse',
            arguments:["Stringify"]
        },
        {
            reqName:"SetDirectoryName",
            objectModel:engine,
            method:'set',
            arguments:['Directory.li.span','entry.name','textContent']
        },
        {
            reqName:"SetDirectoryID",
            objectModel:engine,
            method:'set',
            arguments:['Directory.li.list','UID','id']
        },
        {
            reqName:"directoryHandle",
            objectModel:"parentHandle",
            method:'getDirectoryHandle',
            arguments:['entry.name']
        },
        {
            reqName:"MakeANEntryInIndexDB",
            objectModel:indexDB,
            method:'set',
            arguments:['UID',"directoryHandle"]
        },
        {
            reqName:"IncludeInObj",
            objectModel:engine,
            method:'set',
            arguments:[obj,"Directory","entry.name"]
        },
        {
            //call this json For Directory again
        }
    ]
}
var jsonForDirectory_File = {
    flowRequest:[
        {
            reqName:"UID",
            objectModel:processFS,
            method:'uid'
        },
        {
            validate:{
                objectModel:operate,
                method:'isEqual',
                arguments:['entry.kind','file'],
                output:true
            },
            reqName:"Stringify",
            objectModel:JSON,
            method:'stringify',
            arguments:[fileJSON],
            exitBeforeExecutingRequest:true,
        }, 
        {
            reqName:"File",
            objectModel:JSON,
            method:'Parse',
            arguments:["Stringify"]
        },
        {
            reqName:"SetFileName",
            objectModel:engine,
            method:'set',
            arguments:['File','entry.name','textContent']
        },
        {
            reqName:"SetFileID",
            objectModel:engine,
            method:'set',
            arguments:['File','UID','id']
        },
        {
            reqName:"getFileHandle",
            objectModel:"parentHandle",
            method:'getFileHandle',
            arguments:['entry.name']
        },
        {
            reqName:"MakeANEntryInIndexDB",
            objectModel:indexDB,
            method:'set',
            arguments:['UID',"getFileHandle"]
        },
        {
            reqName:"IncludeInObj",
            objectModel:engine,
            method:'set',
            arguments:[obj,"File","entry.name"]
        },
    ]
}
//RecentFiles flow
var recentFilesFlowRequest = {
    flowRequest:[
        {
            reqName:'Fileid',
            objectModel:document,
            method: 'getElementById',
            arguments:['inlineContent'],
            callBack:{method:'getAttribute',arguments:['fileid']}
        },
        {
            reqName:'SetArrayValue',
            validate:{
                objectModel:indexDB,
                method:'get',
                arguments:['RecentFiles'],
                output: undefined,
            },
            objectModel:indexDB,
            method:'set',
            arguments:['RecentFiles', []]
        },
        {
            validate:{
                objectModel:operate,
                method:'isEqual',
                arguments:['Fileid.length',0],
                output:false
            },
            reqName:'Array',
            objectModel:indexDB,
            method:'get',
            arguments:['RecentFiles'],
            exitBeforeExecutingRequest:true
        },
        {
            reqName:'Element',//1
            objectModel: document,
            method: "getElementById",
            arguments: ["RecentFiles"],
        },
        {
            reqName:'IncludeFileIDOfTheFile',
            validate:{
                objectModel:operate,
                method:'isInsideArray',
                arguments:["Fileid",'Array'],//'Array'
                output:false
            },
            objectModel:'Array',
            method:'unshift',
            arguments:['Fileid'],
            exitBeforeExecutingRequest:true
        },
        {
            reqName:'RemovingAnItem',
            validate:{
                objectModel:operate,
                method:'isEqualStrict',
                arguments:['Array.length',11],
                output:true,
            },
            objectModel:'Array',
            method:'shift',
        },
        {
            reqName:'RemovingChildNodeRecentFiles',
            validate:{
                objectModel:operate,
                method:'isEqualStrict',
                arguments:['Element.childNodes.length',10],
                output:true,
            },
            objectModel:'Element',
            method:'removeChild',
            arguments:['Element.childNodes.0']
        },
        {
            reqName:'FileHandle',
            objectModel:indexDB,
            method:'get',
            arguments:['Fileid']
        },
        // {
        //     reqName:'JSONForFile',
        //     objectModel:processFS,
        //     method:'jsonForFile',
        //     arguments:['Fileid','RecentFiles','FileHandle']
        // },
        {
            reqName:'SetUIDToFileJSON',
            objectModel:engine,
            method:'set',
            arguments:[fileJSON,"Fileid","id",]
        },
        {
            reqName:"SetNameToLocalStorageFile",
             validate:{
                 objectModel:operate,
                 method:'isNotEmpty',
                 arguments:["FileHandle"],
                 output:false
             },
             objectModel:engine,
             method:'set',
             arguments:[fileJSON,"Fileid","textContent"]
        },
        {
            reqName:'file',
            validate:{
                objectModel:operate,
                method:'isNotEmpty',
                arguments:["FileHandle"],
                output:true
            },
            objectModel:"FileHandle",
            method:'getFile'
        },
        {
            reqName:'SetNameToFSFile',
            validate:{
                objectModel:operate,
                method:'isNotEmpty',
                arguments:["FileHandle"],
                output:true
            },
            objectModel:engine,
            method:'set',
            arguments:[fileJSON,"file.name","textContent"]
        },
        {
            reqName:"StringifyJSON",
            objectModel:JSON,
            method:'stringify',
            arguments:[{}]
        },
        {
            reqName:"ParseJSON",
            objectModel:JSON,
            method:'parse',
            arguments:["StringifyJSON"]
        },
        {
            reqName:'input',
            objectModel:engine,
            method:'set',
            arguments:["ParseJSON",fileJSON,"Fileid"]
        },
        {
            reqName:"newEntity",
            objectModel:ActionView,
            method:'newEntity',
            arguments:['input',"Element"]
        },
        {
            reqName:'SetRecentFilesLocalStorage',
            objectModel:localStorage,
            method:'setItem',
            arguments:['UserRecentFiles',"Element.innerHTML"]
        },
        {
            reqName:"setRecentFilesInIndexDB",
            objectModel:indexDB,
            method:'set',
            arguments:['RecentFiles','Array']
        },
    ]
}
var LoginFlowRequest = {
    flowRequest:[
        {
            reqName:'GetUsername',
            objectModel:document,
            method: "getElementById",
            arguments: ["username"],
            andThen:['value']
        },
        {
            reqName:'GetPassword',
            objectModel:document,
            method: "getElementById",
            arguments: ["password"],
            andThen:['value']
        },
        {
            reqName:'SetUsername',
            objectModel:engine,
            method:'set',
            arguments:[paramsJSON,'GetUsername','Username'],
        },
        {
            reqName:'SetPassword',
            objectModel:engine,
            method:'set',
            arguments:[paramsJSON,'GetPassword','Password'],
        },
        {
            reqName:'URLBuilder',
            objectModel:HttpService,
            method:'urlBuilder',
            arguments:[scriptURL,paramsJSON]
        },
        {
            reqName:'RequestBuilder',
            objectModel:HttpService,
            method:'requestBuilder',
            arguments:["GET"]
        },
        {
            reqName:'response',
            objectModel:HttpService,
            method:'fetchRequest',
            arguments:['URLBuilder','RequestBuilder']
        },
        {

            reqName:'alert',
            objectModel:window,
            method:'alert',
            arguments:['response.output']
        },
        {
            validate:{
                objectModel:operate,
                method:'isEqual',
                arguments:['response.result','Success'],
                output:false
            },
            reqName:'getFormElement',
            objectModel:document,
            method:'getElementById',
            arguments:['regForm'],
            callBack:{method:'reset'}
        },
        {
            reqName:"SetLoggedIn",
            validate:{
                objectModel:operate,
                method:'isEqual',
                arguments:['response.result','Success'],
                output:true
            },
            objectModel:localStorage,
            method:'setItem',
            arguments:['LoggedIn',true],
        },
        {
            reqName:'RedirectingToActionSpaceEditor',
            validate:{
                objectModel:operate,
                method:'isEqual',
                arguments:['response.result','Success'],
                output:true
            },
            objectModel: ActionController,
            method:'onChangeRoute',
            arguments:["action"],
        }
    ]
}
var SignUpFlowRequest = {
    flowRequest:[
        {
            reqName:'GetUsername',
            objectModel:document,
            method: "getElementById",
            arguments: ["username"],
            andThen:['value']
        },
        {
            reqName:'GetPassword',
            objectModel:document,
            method: "getElementById",
            arguments: ["password"],
            andThen:['value']
        },
        {
            reqName:'SetUsername',
            objectModel:engine,
            method:'set',
            arguments:[paramsJSON,'GetUsername','Username'],
        },
        {
            reqName:"SetPassword",
            objectModel:engine,
            method:'set',
            arguments:[paramsJSON,'GetPassword','Password']
        },
        {
            reqName:'PostContent',
            objectModel:JSON,
            method:'stringify',
            arguments:[paramsJSON]
        },
        {
            reqName:'RequestBuilder',
            objectModel:HttpService,
            method:'requestBuilder',
            arguments:["POST",undefined,'PostContent']
        },
        {
            reqName:'response',
            objectModel:HttpService,
            method:'fetchRequest',
            arguments:[scriptURL,'RequestBuilder']
        },
        {
            reqName:'alert',
            objectModel:window,
            method:'alert',
            arguments:['response.output']
        },
        {
            reqName:"SetLoggedIn",
            validate:{
                objectModel:operate,
                method:'isEqual',
                arguments:['response.result','Success'],
                output:true
            },
            objectModel:localStorage,
            method:'setItem',
            arguments:['LoggedIn',true],
        },
        {
            reqName:'RedirectingToActionSpaceEditor',
            validate:{
                objectModel:operate,
                method:'isEqual',
                arguments:['response.result','Success'],
                output:true
            },
            objectModel: ActionController,
            method:'onChangeRoute',
            arguments:["action"],
        }
    ]
}
var importFromSheetFlowRequest = {
    flowRequest:[
        {
            reqName:'GetSpreadsheetId',
            objectModel:document,
            method: "getElementById",
            arguments: ["spreadsheetID"],
            andThen:['value']
        },  
        {
            reqName:'GetNamedRange',
            objectModel:document,
            method: "getElementById",
            arguments: ['NamedRange'],
            andThen:['value']
        },
        {
            reqName:'SetSpreadsheetId',
            objectModel:engine,
            method:'set',
            arguments:[importFromSheetparamsJSON,'GetSpreadsheetId','SpreadsheetId']
        },
        {
            reqName:'SetNamedRange',
            objectModel:engine,
            method:'set',
            arguments:[importFromSheetparamsJSON,'GetNamedRange','NamedRange']
        },
        {
            reqName:'CloseModal',
            objectModel:ActionView,
            method:'closeModal',
            arguments:[]//event will be appended
        },
        {
            reqName:'URLBuilder',
            objectModel:HttpService,
            method:'urlBuilder',
            arguments:[scriptURL,importFromSheetparamsJSON]
        },
        {
            reqName:'RequestBuilder',
            objectModel:HttpService,
            method:'requestBuilder',
            arguments:["GET"]
        },
        {
            reqName:'response',
            objectModel:HttpService,
            method:'fetchRequest',
            arguments:['URLBuilder','RequestBuilder']
        },
    ]
}
var exportToSheetFlowRequest = {
    flowRequest:[
        {
            reqName:'GetSpreadsheetId',
            objectModel:document,
            method: "getElementById",
            arguments: ["spreadsheetID"],
            andThen:['value']
        },  
        {
            reqName:'GetSheetName',
            objectModel:document,
            method: "getElementById",
            arguments: ['sheetName'],
            andThen:['value']
        },
        {
            reqName:'SetSpreadsheetId',
            objectModel:engine,
            method:'set',
            arguments:[exportToSheetparamsJSON,'GetSpreadsheetId','SpreadsheetId']
        },
        {
            reqName:'SetNamedRange',
            objectModel:engine,
            method:'set',
            arguments:[exportToSheetparamsJSON,'GetSheetName','SheetName']
        },
        {
            reqName:'CloseModal',
            objectModel:ActionView,
            method:'closeModal',
            arguments:[]//event will be appended
        },
        {
            reqName:'stringifyParams',
            objectModel:JSON,
            method:'stringify',
            arguments:[exportToSheetparamsJSON]
        },
        {
            reqName:'RequestBuilder',
            objectModel:HttpService,
            method:'requestBuilder',
            arguments:["POST",undefined,'stringifyParams']
        },  
        {
            reqName:'response',
            objectModel:HttpService,
            method:'fetchRequest',
            arguments:[scriptURL,'RequestBuilder']
        },
        {
            validate:{
                objectModel:operate,
                method:'isNotEmpty',
                arguments:['response'],
                output:true
            },
            reqName:'Alert',
            objectModel:window,
            method:'alert',
            arguments:['response.output']
        },
    ]
}