import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from "react";
import { StyleSheet, SafeAreaView, FlatList, View, BackHandler, Dimensions } from "react-native";
import { apiGet } from "../../../../services/api";
import { SearchBar, Overlay } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/stack";
import MyEmpty from "../../../../components/MyEmpty";
import {Picker} from '@react-native-community/picker';
import MyButton from "../../../../components/MyButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import { successColor, infoColor, whiteColor, moduleIncoming } from "../../../../services/constant";
import MyButtonMenuRight from "../../../../components/MyButtonMenuRight";
import { myError, getNameStatusIncomingMail } from "../../../../utils/MyUtil";
import ItemIncomingMail from "./ItemIncomingMail";
import MyLoadingCenter from "../../../../components/MyLoadingCenter";
import { getPermissionUser } from "../../../../services/storage";

const path_api = "incoming-mails";

const IncomingMail = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(false);
    const [datas, setDatas] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [statusSearch, setStatusSearch] = useState(false);
    const [page, setPage] = useState(1);
    const [typeId, setTypeId] = useState("");
    const [typeData, setTypeData] = useState([]);
    const [classificationId, setClassificationId] = useState("");
    const [classificationData, setClassificationData] = useState([]);
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
                getDatas(1,typeId,classificationId);
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
            getDatas(page,typeId,classificationId,true);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);
    useEffect(() => {
        if (visibleFilter) {
            getFilterData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleFilter]);

    const getFilterData = async () => {
        try {
            setLoadingInit(true);
            if (typeData.length === 0) {
                const [
                    _resultClass,
                    _resultType
                ] = await Promise.all([
                    apiGet("classifications/select/data"),
                    apiGet("types/select/data")
                ]);
                setClassificationData(_resultClass.data);
                setTypeData(_resultType.data);
            }
            setLoadingInit(false);
        } catch (error) {
            setLoadingInit(false);
            myError(error,navigation);   
        }
    }

    const init = async () => {
        setLoadingInit(true);
        try {            
            const result = await apiGet(path_api + 
                "?page=1" + 
                "&per_page=15" + 
                "&classification_id=" + classificationId + 
                "&type_id=" + typeId +
                "&start_date="+
                "&end_date="
            );
            const pms = await getPermissionUser();
            let _menuInfo = pms.find(item => item.module === moduleIncoming);
            let _data = result.data ? result.data.map(item => ({
                ...item,
                status_code: item.status.status_code,
                permission:_menuInfo ? _menuInfo.function : [],
                id:item.id,
                is_read: item.is_read === 1 ? true : false,
                subject_letter:item.subject_letter.charAt(0) === " " ? item.subject_letter.replace(" ","") : item.subject_letter,
                letter_date:item.letter_date,
                number_letter:item.number_letter,
                sender_name:item.sender_name,
                follow_up:item.follow_up,
                status: item.status,
                type_name:item.type.name
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
            setLoadingInit(false);
        } catch (error) {
            setDatas([]);
            setLoadingInit(false);
            myError(error,navigation);    
        }
    }

    const getDatas = async (_page,_type,_classification,isPush = false) => {
        try {
            setLoading(true)
            const result = await apiGet(path_api + 
                "?page=" + _page +
                "&per_page=15" + 
                "&classification_id=" + _classification + 
                "&type_id=" + _type +
                "&start_date="+
                "&end_date="
            );
            const pms = await getPermissionUser();
            let _menuInfo = pms.find(item => item.module === moduleIncoming);
            let _data = result.data ? result.data.map(item => ({
                ...item,
                status_code: item.status.status_code,
                permission:_menuInfo ? _menuInfo.function : [],
                id:item.id,
                is_read: item.is_read === 1 ? true : false,
                subject_letter:item.subject_letter.charAt(0) === " " ? item.subject_letter.replace(" ","") : item.subject_letter,
                letter_date:item.letter_date,
                number_letter:item.number_letter,
                sender_name:item.sender_name,
                follow_up:item.follow_up,
                status: item.status,
                type_name:item.type.name
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
                "&classification_id=" + classificationId + 
                "&type_id=" + typeId +
                "&keyword=" + searchText
            );
            const pms = await getPermissionUser();
            let _menuInfo = pms.find(item => item.module === moduleIncoming);
            let _data = result.data ? result.data.map(item => ({
                ...item,
                status_code: item.status.status_code,
                permission:_menuInfo ? _menuInfo.function : [],
                id:item.id,
                is_read: item.is_read === 1 ? true : false,
                subject_letter:item.subject_letter.charAt(0) === " " ? item.subject_letter.replace(" ","") : item.subject_letter,
                letter_date:item.letter_date,
                number_letter:item.number_letter,
                sender_name:item.sender_name,
                follow_up:item.follow_up,
                status: item.status,
                type_name:item.type.name
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
        getDatas(1,typeId,classificationId);
        setPage(1);
    }

    const onResetFilter = () => {
        setTypeId("")
        setClassificationId("")
    }
    const onOkFilter = () => {
        setVisibleFilter(!visibleFilter);
        getDatas(1,typeId,classificationId);
        setPage(1);
    }
    const onDisposition = (value) => {
        navigation.navigate("DispositionCreate", {
            incoming_mail_id: value,
            type: 'disposition',
            parent_disposition_id: 0
        })
    }
    return (
        loadingInit ? <MyLoadingCenter/> : 
        <SafeAreaView style={styles.container}>
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
                data={datas}
                // ItemSeparatorComponent={MySeparator}
                ListFooterComponent={() => <View style={{marginBottom:16}}></View>}
                renderItem={({ item }) => 
                    <ItemIncomingMail 
                        data={item}
                        onDispo={onDisposition}
                        onPress={() => {
                            navigation.navigate("IncomingMailDetail",{
                                id:item.id,
                                follow_up:item.follow_up,
                                status_message:getNameStatusIncomingMail(item.status)
                            });
                        }}
                    />
                }
                contentContainerStyle={datas.length === 0 && styles.centerEmptySet}
                keyExtractor={item => item.id.toString()}
                refreshing={loading}
                onRefresh={onRefresh}
                onEndReachedThreshold={0.4}
                onEndReached={onLoadMore}
                ListEmptyComponent={loading ? null : MyEmpty}
            />
            <Overlay isVisible={visibleFilter}>
                <View style={{width:Dimensions.get("window").width - 100}}>
                    <Picker
                        mode="dropdown"
                        selectedValue={typeId}
                        onValueChange={(itemValue, itemIndex) => {
                            setTypeId(itemValue);
                        }}>
                        <Picker.Item label="Pilih Jenis" value="" />
                        {
                            typeData.map((item,x) => {
                                return (
                                    <Picker.Item key={x} label={item.name} value={item.id} />
                                )
                            })
                        }
                    </Picker>
                    <Picker
                        mode="dropdown"
                        selectedValue={classificationId}
                        onValueChange={(itemValue, itemIndex) => {
                            setClassificationId(itemValue);
                        }}>
                        <Picker.Item label="Pilih Klasifikasi" value="" />
                        {
                            classificationData.map((item,x) => {
                                return (
                                    <Picker.Item key={x} label={item.name} value={item.id} />
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
      flex: 1,
      backgroundColor:whiteColor
    },
    centerEmptySet: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%' 
    }
});
export default IncomingMail;