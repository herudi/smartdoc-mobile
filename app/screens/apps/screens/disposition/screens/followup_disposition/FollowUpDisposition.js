import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, SafeAreaView, FlatList, View } from "react-native";
import { apiGet } from "../../../../../../services/api";
import { myError } from "../../../../../../utils/MyUtil";
import MyLoadingCenter from "../../../../../../components/MyLoadingCenter";
import ItemFollowUpDisposition from "./ItemFollowUpDisposition";
import MyEmpty from "../../../../../../components/MyEmpty";
import { whiteColor } from "../../../../../../services/constant";
import { HeaderBackButton } from "@react-navigation/stack";

const path_api = "dispositions-follow";

const FollowUpDisposition = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(false);
    const [datas, setDatas] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBackButton tintColor="white" onPress={() => {
                    navigation.goBack();
                }}/>
            )
        });
    },[navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            init();
        });
        return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[navigation]);

    useEffect(() => {
        if (page > 1) {
            getDatas(page,true);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    
    const init = async () => {
        setLoadingInit(true);
        try {            
            const result = await apiGet(path_api + 
                "?page=1" + 
                "&per_page=15"
            );
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
            let _data = result.data ? result.data.map(item => ({
                ...item,
                from_employee_name:item.from_employee ? item.from_employee.name : "",
                subject_disposition:item.subject_disposition.charAt(0) === " " ? item.subject_disposition.replace(" ","") : item.subject_disposition,
            })): [];
            setDatas(_data);
            setPage(1);
            setLoadingInit(false);
        } catch (error) {
            setDatas([]);
            setLoadingInit(false);
            myError(error,navigation);    
        }
    }

    const getDatas = async (_page,isPush = false) => {
        try {
            setLoading(true)
            const result = await apiGet(path_api + 
                "?page=1" + 
                "&per_page=15"
            );
            let _data = result.data ? result.data.map(item => ({
                ...item,
                from_employee_name:item.from_employee ? item.from_employee.name : "",
                subject_disposition:item.subject_disposition.charAt(0) === " " ? item.subject_disposition.replace(" ","") : item.subject_disposition,
            })): [];
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
        let _page = page+1;
        if (pagination.totalPage) {
            if (_page <= pagination.totalPage) {
                setPage(_page);
            }
        }   
    }

    const onRefresh = () => {
        getDatas(1);
        setPage(1);
    }

    const onMoreDetail = (_id, _finish_follow) => {
        navigation.navigate("DispositionFollowUpUpdate",{
            id: _id,
            finish_follow: _finish_follow
        });
    }

    const onDispo = (_incoming_mail_id, _id) => {
        navigation.navigate("DispositionCreate", {
            incoming_mail_id: _incoming_mail_id,
            type: 'redisposition',
            parent_disposition_id: _id
        })
    }

    return (
        loadingInit ? <MyLoadingCenter/> : 
        <SafeAreaView style={styles.container}>
           
            <FlatList
                data={datas}
                ListFooterComponent={() => <View style={{marginBottom:16}}></View>}
                renderItem={({ item }) => 
                    <ItemFollowUpDisposition 
                        data={item} 
                        onPress={onMoreDetail}
                        onDispo={onDispo}
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
export default FollowUpDisposition;