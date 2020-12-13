import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { apiGet } from '../../../../../../services/api';
import { myError } from '../../../../../../utils/MyUtil';
// import { testChildDispo, successColor } from './../../../../../../services/constant';
import MyLoadingCenter from "../../../../../../components/MyLoadingCenter";
import TreeView from 'react-native-final-tree-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ItemAssignTracking from './ItemAssignTracking';

function getIndicator(isExpanded, hasChildrenNodes) {
    if (!hasChildrenNodes) {
        return <AntDesign name="minus" size={18} />
    } else if (isExpanded) {
        return <AntDesign name="caretdown" size={18} />
    } else {
        return <AntDesign name="caretright" size={18} />
    }
}
// const dataTest = testChildDispo;

const TrackingRedisposition = ({ navigation, route }) => {
    const { id } = route.params;
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const init = async () => {
        try {
            setLoading(true);
            const result = await apiGet("dispositions/detail/" + id);
            setDatas(result.data);
            setLoading(false)
        } catch (error) {
            setDatas([]);
            setLoading(false);
            myError(error, navigation);
        }
    }
    return (
        loading ? <MyLoadingCenter /> :
            <ScrollView style={{padding: 9 }}>
                <TreeView
                    data={datas}
                    renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                        return (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    margin: 7
                                }}
                            >
                                <Text
                                    style={{
                                        marginLeft: 10 * level,
                                    }}
                                >
                                    {getIndicator(isExpanded, hasChildrenNodes)}
                                </Text>
                                <View
                                    style={{
                                        marginLeft: 5,
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Text>Tanggal : {node.disposition_date}</Text>
                                    <Text>Nomor : {node.number_disposition}</Text>
                                    <Text>Pegawai : {node.employee ? node.employee.name : ''}</Text>
                                    <Text>Menugaskan Kepada : </Text>
                                    <View>
                                        {
                                            node.assigns && node.assigns.map((item, x) => {
                                                const _data = {
                                                    id: item.id,
                                                    is_read: item.is_read === 1 ? true : false,
                                                    follow_up: item.follow_up,
                                                    structure_name: item.structure ? item.structure.name : "",
                                                    employee_name: item.employee ? item.employee.name : "",
                                                    class_disposition_name: item.class_disposition ? item.class_disposition.name : "",
                                                }
                                                return (
                                                    <ItemAssignTracking
                                                        key={x}
                                                        item={_data}
                                                    />
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    getCollapsedNodeHeight={() => 500}
                />
            </ScrollView>
    )
}

export default TrackingRedisposition;