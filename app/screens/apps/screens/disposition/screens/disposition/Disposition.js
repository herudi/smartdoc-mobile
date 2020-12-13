import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from "react";
import { StyleSheet, SafeAreaView, FlatList, View, BackHandler, Dimensions, Alert } from "react-native";
import { apiGet, apiDelete } from "../../../../../../services/api";
import { SearchBar, Overlay } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/stack";
import MyEmpty from "../../../../../../components/MyEmpty";
import {Picker} from '@react-native-community/picker';
import MyButton from "../../../../../../components/MyButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { successColor, infoColor, moduleDisposition } from "../../../../../../services/constant";
import MyButtonMenuRight from "../../../../../../components/MyButtonMenuRight";
import { myError, statusDisposition } from "../../../../../../utils/MyUtil";
import MyLoadingCenter from "../../../../../../components/MyLoadingCenter";
import ItemDisposition from "./ItemDisposition";
import MyFloatButton from "../../../../../../components/MyFloatButton";
import MySimpleButton from "../../../../../../components/MySimpleButton";
import { getPermissionUser } from "../../../../../../services/storage";

const path_api = "dispositions";

const Disposition = ({navigation}) => {
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingTea, setLoadingTea] = useState(false);
    const [datas, setDatas] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [statusSearch, setStatusSearch] = useState(false);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("0");
    const [pagination, setPagination] = useState({});
    const [visibleFilter, setVisibleFilter] = useState(false);
    const searchRef = useRef();

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (visibleFilter) {
                    setVisibleFilter(false);
                    return true;
                }else if (showSearch) {
                    setShowSearch(false);
                    return true;
                } else {
                    return false;
                }
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [showSearch, visibleFilter])
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{marginRight:10,flex:1,flexDirection:"row",alignItems:"center"}}>
                    <MyButtonMenuRight iconName="search1" onPress={() => {
                        setShowSearch(!showSearch);
                    }}/>
                    <View style={{paddingLeft:5}}></View>
                    <MyButtonMenuRight iconName="filter" onPress={() => {
                        setVisibleFilter(true);
                    }}/>
                </View>
            ),
            headerLeft: () => (
                <HeaderBackButton tintColor="white" onPress={() => {
                    if (showSearch) {
                        setShowSearch(false);
                    } else {
                        navigation.goBack();
                    }
                }}/>
            )
        });
    },[navigation, showSearch]);

    useEffect(() => {
        if (showSearch) {
            searchRef.current.focus();
        }else{
            if (statusSearch) {
                getDatas(1,status);
                setStatusSearch(false)
            }
            setSearchText("");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSearch]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            init();
        });
        return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[navigation]);

    useEffect(() => {
        if (page > 1) {
            getDatasMore(page,status,true);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);


    const init = async () => {
        setLoadingTea(true);
        try {
            const result = await apiGet(path_api + 
                "?page=1" + 
                "&per_page=15" + 
                "&status=" + status + 
                "&start_date="+
                "&end_date="
            );
            const pms = await getPermissionUser();
            let _menuInfo = pms.find(item => item.module === moduleDisposition);
            let _data = result.data ? result.data.map(item => ({
                ...item,
                id:item.id,
                subject_disposition:item.subject_disposition.charAt(0) === " " ? item.subject_disposition.replace(" ","") : item.subject_disposition,
                disposition_date:item.disposition_date,
                number_disposition:item.number_disposition,
                from_employee:item.from_employee ? item.from_employee.name : "",
                status:item.status,
                status_code: item.status ? item.status.status_code : 0,
                progress:item.progress ? item.progress : "",
                permission:_menuInfo ? _menuInfo.function : []
            })) : [];
            const meta = result.meta;
            if (meta) {
                const paging = meta.pagination;
                setPagination({
                    current: paging.current_page,
                    pageSize: paging.per_page,
                    total: paging.total,
                    totalPage: paging.total_pages,
                });
            }
            setPage(1);
            setDatas(_data);
            setLoadingTea(false);
        } catch (error) {
            setDatas([]);
            setLoadingTea(false);
            myError(error,navigation);    
        }
    }

    const getDatas = async (_page,_status,isPush = false) => {
        try {
            setLoading(true)
            const result = await apiGet(path_api + 
                "?page=" + _page +
                "&per_page=15" + 
                "&status=" + _status + 
                "&start_date="+
                "&end_date="
            );
            const pms = await getPermissionUser();
            let _menuInfo = pms.find(item => item.module === moduleDisposition);
            let _data = result.data ? result.data.map(item => ({
                ...item,
                id:item.id,
                subject_disposition:item.subject_disposition.charAt(0) === " " ? item.subject_disposition.replace(" ","") : item.subject_disposition,
                disposition_date:item.disposition_date,
                number_disposition:item.number_disposition,
                from_employee:item.from_employee ? item.from_employee.name : "",
                status:item.status,
                status_code: item.status ? item.status.status_code : 0,
                progress:item.progress ? item.progress : "",
                permission:_menuInfo ? _menuInfo.function : []
            })) : [];
            const meta = result.meta;
            if (meta) {
                const paging = meta.pagination;
                setPagination({
                    current: paging.current_page,
                    pageSize: paging.per_page,
                    total: paging.total,
                    totalPage: paging.total_pages,
                });
            }
            if (!isPush) {
                setPage(1);
                setDatas(_data);
            }else{
                const _list = datas;
                for (let i = 0; i < _data.length; i++) {
                    _list.push(_data[i])
                }
                setDatas(_list);
            }
            setLoading(false)
        } catch (error) {
            setDatas([]);
            setLoading(false);
            myError(error,navigation);  
        }
    }

    const getDatasMore = async (_page,_status,isPush = false) => {
        try {
            setLoadingMore(true)
            const result = await apiGet(path_api + 
                "?page=" + _page +
                "&per_page=15" + 
                "&status=" + _status + 
                "&start_date="+
                "&end_date="
            );
            const pms = await getPermissionUser();
            let _menuInfo = pms.find(item => item.module === moduleDisposition);
            let _data = result.data ? result.data.map(item => ({
                ...item,
                id:item.id,
                subject_disposition:item.subject_disposition.charAt(0) === " " ? item.subject_disposition.replace(" ","") : item.subject_disposition,
                disposition_date:item.disposition_date,
                number_disposition:item.number_disposition,
                from_employee:item.from_employee ? item.from_employee.name : "",
                status:item.status,
                status_code: item.status ? item.status.status_code : 0,
                progress:item.progress ? item.progress : "",
                permission:_menuInfo ? _menuInfo.function : []
            })) : [];
            const meta = result.meta;
            if (meta) {
                const paging = meta.pagination;
                setPagination({
                    current: paging.current_page,
                    pageSize: paging.per_page,
                    total: paging.total,
                    totalPage: paging.total_pages,
                });
            }
            if (!isPush) {
                setPage(1);
                setDatas(_data);
            }else{
                const _list = datas;
                for (let i = 0; i < _data.length; i++) {
                    _list.push(_data[i])
                }
                setDatas(_list);
            }
            setLoadingMore(false)
        } catch (error) {
            setDatas([]);
            setLoadingMore(false);
            myError(error,navigation);  
        }
    }

    const onLoadMore = () => {
        if (!showSearch) {
            let _page = page+1;
            if (pagination.totalPage) {
                if (_page <= pagination.totalPage) {
                    setPage(_page);
                }
            }
        }        
    }

    const updateSearch = search => {
        setSearchText(search);
    };

    const onSearch = async () => {
        try {
            setLoading(true);
            const result = await apiGet(path_api + 
                "?per_page=50" + 
                "&status=" + status + 
                "&keyword=" + searchText
            );
            const pms = await getPermissionUser();
            let _menuInfo = pms.find(item => item.module === moduleDisposition);
            let _data = result.data ? result.data.map(item => ({
                ...item,
                id:item.id,
                subject_disposition:item.subject_disposition.charAt(0) === " " ? item.subject_disposition.replace(" ","") : item.subject_disposition,
                disposition_date:item.disposition_date,
                number_disposition:item.number_disposition,
                from_employee:item.from_employee ? item.from_employee.name : "",
                status:item.status,
                status_code: item.status ? item.status.status_code : 0,
                progress:item.progress ? item.progress : "",
                permission:_menuInfo ? _menuInfo.function : []
            })) : [];
            
            const meta = result.meta;
            if (meta) {
                const paging = meta.pagination;
                setPagination({
                    current: paging.current_page,
                    pageSize: paging.per_page,
                    total: paging.total,
                    totalPage: paging.total_pages,
                });
            }
            setPage(1);
            setStatusSearch(true);
            setDatas(_data);
            setLoading(false)
        } catch (error) {
            
            setDatas([]);
            setLoading(false);
            myError(error,navigation); 
        }
    }

    const onRefresh = () => {
        getDatas(1,status);
        setPage(1);
    }

    const onResetFilter = () => {
        setStatus(0)
    }
    const onOkFilter = () => {
        setVisibleFilter(!visibleFilter);
        getDatas(1,status);
        setPage(1);
    }
    const onTrackingRedispo = (_id) => {
        navigation.navigate("TrackingRedisposition", {
            id: _id
        })
    }
    const onDelete = (_data) => {
        Alert.alert(
            "Confirm",
            "Yakin akan menghapus "+_data.subject_disposition,
            [
                {
                    text: "Batal",
                    onPress: () => {},
                    style: "cancel"
                },
                {
                    text: "Hapus", 
                    onPress: async () => {
                        try {
                            setLoading(true);    
                            await apiDelete(path_api + "/" + _data.id);
                            Alert.alert(
                                "Information",
                                "Sukses hapus " + _data.subject_disposition,
                                [
                                    {
                                        text:"Ok",
                                        onPress:() => {
                                            onRefresh();
                                        }
                                    }
                                ],
                                {cancelable:false}
                            );
                        } catch (error) {
                            setLoading(false)
                            myError(error,navigation);
                        }
                                     
                    }
                }
            ],
            { cancelable: false }
        );
    }
    
    return (
        loadingTea ? <MyLoadingCenter/> : 
        <SafeAreaView style={styles.container}>
            <MyFloatButton onPress={() => {
                navigation.navigate("DispositionCreate", {
                    incoming_mail_id: null,
                    type: 'disposition',
                    parent_disposition_id: 0
                })
            }}/>
            {
                showSearch ? 
                <SearchBar
                    ref={searchRef}
                    placeholder="Type Here..."
                    lightTheme={true}
                    round={true}
                    onChangeText={updateSearch}
                    value={searchText}
                    onSubmitEditing={onSearch}
                />: null
            }
            <FlatList
                style={{padding:7}}
                data={datas}
                ListFooterComponent={
                    <View style={{marginBottom:90,padding:7}}>
                        {
                            loadingMore ? <MyLoadingCenter/> :
                            datas.length === 0 ? null :
                            <MySimpleButton
                                onPress={onLoadMore}
                                title="Load More"
                                color={successColor}
                                iconName="reload"
                                padding={10}
                                fontSize={16}
                            />
                        }
                    </View>
                }
                renderItem={({ item }) => 
                    <ItemDisposition 
                        itemData={item}
                        onDelete={() => onDelete(item)}
                        onTrackingRedispo={onTrackingRedispo}
                        onEdit={() => {
                            navigation.navigate("DispositionUpdate",{
                                id:item.id
                            })
                        }}
                    />
                }
                contentContainerStyle={datas.length === 0 && styles.centerEmptySet}
                keyExtractor={item => item.id.toString()}
                refreshing={loading}
                onRefresh={onRefresh}
                ListEmptyComponent={loading ? null : MyEmpty}
            />
            <Overlay isVisible={visibleFilter}>
                <View style={{width:Dimensions.get("window").width - 100}}>
                    <Picker
                        mode="dropdown"
                        selectedValue={status}
                        onValueChange={(itemValue, itemIndex) => {
                            setStatus(itemValue);
                        }}>
                        <Picker.Item label="Pilih Status" value={"0"} />
                        {
                            statusDisposition.map((item,x) => {
                                return (
                                    <Picker.Item key={x} label={item.name} value={item.value} />
                                )
                            })
                        }
                    </Picker>
                    <View style={{flexDirection:"row",marginTop:20,justifyContent:"flex-end"}}>
                        <MyButton
                            btnStyle={{width:100}}
                            onPress={onResetFilter}
                            title="Reset"
                            color={infoColor}
                            icon={
                                <AntDesign 
                                    name="retweet" 
                                    size={18} 
                                    color="white" 
                                    style={{marginRight:10}}
                                />
                            }
                        />
                        <MyButton
                            btnStyle={{width:100,marginLeft:10}}
                            onPress={onOkFilter}
                            title="OK"
                            color={successColor}
                            icon={
                                <AntDesign 
                                    name="check" 
                                    size={18} 
                                    color="white" 
                                    style={{marginRight:10}}
                                />
                            }
                        />
                    </View>
                    
                </View>
            </Overlay>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    centerEmptySet: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%' 
    }
});
export default Disposition;